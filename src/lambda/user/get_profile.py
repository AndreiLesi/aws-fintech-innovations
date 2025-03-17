import json
import os
import boto3
import logging
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Lambda function to retrieve or update a user's profile.
    
    Args:
        event (dict): API Gateway Lambda Proxy Input Format
        context (object): Lambda Context runtime methods and attributes

    Returns:
        dict: API Gateway Lambda Proxy Output Format
    """
    logger.info(f"User profile request received: {json.dumps(event)}")
    
    # Determine if this is a GET or PUT/POST request
    # API Gateway v2 (HTTP API) uses a different structure than v1 (REST API)
    http_method = None
    
    # Check for API Gateway v2 structure
    if 'requestContext' in event and 'http' in event['requestContext']:
        http_method = event['requestContext']['http'].get('method')
        logger.info(f"Detected HTTP method from requestContext.http.method: {http_method}")
    # Fallback to API Gateway v1 structure
    elif 'httpMethod' in event:
        http_method = event.get('httpMethod')
        logger.info(f"Detected HTTP method from httpMethod: {http_method}")
    # Default to GET if method cannot be determined
    else:
        http_method = 'GET'
        logger.info(f"Could not determine HTTP method, defaulting to: {http_method}")
    
    if http_method == 'GET':
        return get_profile(event, context)
    elif http_method in ['PUT', 'POST']:
        logger.info("Calling update_profile function")
        return update_profile(event, context)
    else:
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Method {http_method} not allowed'
            })
        }

def get_profile(event, context):
    """
    Get a user's profile from DynamoDB.
    """
    try:
        # Extract user ID from the Cognito authorizer
        # The authorizer adds the claims to the requestContext
        user_id = None
        user_email = None
        username = None
        name = None
        
        # Check if we have Cognito claims
        if 'requestContext' in event and 'authorizer' in event['requestContext']:
            authorizer = event['requestContext']['authorizer']
            
            # JWT authorizer puts claims directly in the authorizer object
            if 'claims' in authorizer:
                claims = authorizer['claims']
                user_id = claims.get('sub')
                user_email = claims.get('email')
                username = claims.get('cognito:username')
                name = claims.get('name')
            # Lambda authorizer might put claims in a JWT object
            elif 'jwt' in authorizer and 'claims' in authorizer['jwt']:
                claims = authorizer['jwt']['claims']
                user_id = claims.get('sub')
                user_email = claims.get('email')
                username = claims.get('cognito:username')
                name = claims.get('name')
        
        # Fallback for testing only - remove in production
        if not user_id:
            logger.warning("No user ID found in authorizer, using test user ID")
            user_id = 'test-user-id'
            user_email = 'test@example.com'
            username = 'testuser'
            name = 'Test User'
        
        logger.info(f"Using user ID: {user_id}")
        
        # Initialize DynamoDB client
        dynamodb = boto3.resource('dynamodb')
        table = dynamodb.Table(os.environ.get('USER_SETTINGS_TABLE', 'UserSettings'))
        
        # Get user profile from DynamoDB
        response = table.get_item(
            Key={
                'userId': user_id
            }
        )
        
        # Check if user profile exists
        if 'Item' not in response:
            # If not, create a default profile using Cognito attributes
            default_profile = {
                'userId': user_id,
                'email': user_email or f'{user_id}@example.com',
                'username': username,
                'name': name or '',
                'bio': '',
                'preferences': {
                    'theme': 'light',
                    'currency': 'USD',
                    'notifications': True
                }
            }
            
            # Save default profile to DynamoDB
            table.put_item(Item=default_profile)
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': True
                },
                'body': json.dumps(default_profile)
            }
        
        # Return existing profile, but update with latest Cognito attributes if available
        profile = response['Item']
        
        # Update profile with Cognito attributes if they exist and are not already set
        if user_email and not profile.get('email'):
            profile['email'] = user_email
        
        if username and not profile.get('username'):
            profile['username'] = username
            
        if name and not profile.get('name'):
            profile['name'] = name
            
        # Save updated profile back to DynamoDB if changes were made
        if (user_email and not response['Item'].get('email')) or \
           (username and not response['Item'].get('username')) or \
           (name and not response['Item'].get('name')):
            table.put_item(Item=profile)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(profile)
        }
    except ClientError as e:
        logger.error(f"DynamoDB error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Database error: {str(e)}'
            })
        }
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Error retrieving user profile: {str(e)}'
            })
        }

def update_profile(event, context):
    """
    Update a user's profile in DynamoDB.
    """
    logger.info("Starting update_profile function")
    try:
        # Extract user ID from the Cognito authorizer
        user_id = None
        
        # Check if we have Cognito claims
        if 'requestContext' in event and 'authorizer' in event['requestContext']:
            authorizer = event['requestContext']['authorizer']
            
            # JWT authorizer puts claims directly in the authorizer object
            if 'claims' in authorizer:
                user_id = authorizer['claims'].get('sub')
                logger.info(f"Found user_id in authorizer.claims: {user_id}")
            # Lambda authorizer might put claims in a JWT object
            elif 'jwt' in authorizer and 'claims' in authorizer['jwt']:
                user_id = authorizer['jwt']['claims'].get('sub')
                logger.info(f"Found user_id in authorizer.jwt.claims: {user_id}")
        
        # Fallback for testing only - remove in production
        if not user_id:
            logger.warning("No user ID found in authorizer, using test user ID")
            user_id = 'test-user-id'
        
        logger.info(f"Updating profile for user ID: {user_id}")
        
        # Parse the request body
        body = json.loads(event.get('body', '{}'))
        logger.info(f"Request body: {json.dumps(body)}")
        
        # Initialize DynamoDB client
        dynamodb = boto3.resource('dynamodb')
        table_name = os.environ.get('USER_SETTINGS_TABLE', 'UserSettings')
        logger.info(f"Using DynamoDB table: {table_name}")
        table = dynamodb.Table(table_name)
        
        # Get existing profile
        logger.info(f"Getting existing profile for user ID: {user_id}")
        response = table.get_item(
            Key={
                'userId': user_id
            }
        )
        
        # Create or update profile
        if 'Item' not in response:
            logger.info(f"No existing profile found for user {user_id}, creating new profile")
            # Create new profile
            profile = {
                'userId': user_id,
                'email': body.get('email', ''),
                'username': user_id,  # Use user_id as username by default
                'name': body.get('name', ''),
                'bio': body.get('bio', ''),
                'preferences': body.get('preferences', {
                    'theme': 'light',
                    'currency': 'USD',
                    'notifications': True
                })
            }
        else:
            logger.info(f"Existing profile found for user {user_id}, updating profile")
            # Update existing profile
            profile = response['Item']
            logger.info(f"Original profile: {json.dumps(profile)}")
            
            # Update fields if provided
            if 'email' in body:
                profile['email'] = body['email']
                logger.info(f"Updated email to: {body['email']}")
            if 'name' in body:
                profile['name'] = body['name']
                logger.info(f"Updated name to: {body['name']}")
            if 'bio' in body:
                profile['bio'] = body['bio']
                logger.info(f"Updated bio to: {body['bio']}")
            if 'preferences' in body:
                # Merge preferences
                if not profile.get('preferences'):
                    profile['preferences'] = {}
                
                # Handle the case where preferences might be a string or a boolean
                preferences_data = body['preferences']
                if isinstance(preferences_data, dict):
                    # If it's a dictionary, merge it with existing preferences
                    for key, value in preferences_data.items():
                        profile['preferences'][key] = value
                    logger.info(f"Updated preferences to: {json.dumps(profile['preferences'])}")
                else:
                    # If it's not a dictionary, log a warning
                    logger.warning(f"Preferences is not a dictionary: {preferences_data}")
                    # Still try to use it if it's a valid JSON string
                    try:
                        if isinstance(preferences_data, str):
                            parsed_prefs = json.loads(preferences_data)
                            if isinstance(parsed_prefs, dict):
                                for key, value in parsed_prefs.items():
                                    profile['preferences'][key] = value
                                logger.info(f"Updated preferences from string to: {json.dumps(profile['preferences'])}")
                    except Exception as e:
                        logger.error(f"Error parsing preferences: {str(e)}")
                        # Keep the existing preferences
            
            logger.info(f"Updated profile: {json.dumps(profile)}")
        
        # Save profile to DynamoDB
        logger.info(f"Saving profile to DynamoDB: {json.dumps(profile)}")
        table.put_item(Item=profile)
        logger.info("Profile saved successfully to DynamoDB")
        
        # Return the updated profile
        logger.info("Returning updated profile")
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(profile)
        }
    except Exception as e:
        logger.error(f"Error updating user profile: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Error updating user profile: {str(e)}'
            })
        } 
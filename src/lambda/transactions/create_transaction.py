import json
import os
import boto3
import logging
import uuid
from datetime import datetime, timezone
from botocore.exceptions import ClientError
from utils.dynamodb_utils import serialize_to_dynamodb

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Lambda function to create a new transaction.
    
    Args:
        event (dict): API Gateway Lambda Proxy Input Format
        context (object): Lambda Context runtime methods and attributes

    Returns:
        dict: API Gateway Lambda Proxy Output Format
    """
    logger.info(f"Create transaction request received: {json.dumps(event)}")
    
    try:
        # Extract user ID from the Cognito authorizer
        # The authorizer adds the claims to the requestContext
        user_id = None
        
        # Check if we have Cognito claims
        if 'requestContext' in event and 'authorizer' in event['requestContext']:
            authorizer = event['requestContext']['authorizer']
            
            # JWT authorizer puts claims directly in the authorizer object
            if 'claims' in authorizer and 'sub' in authorizer['claims']:
                user_id = authorizer['claims']['sub']
            # Lambda authorizer might put claims in a JWT object
            elif 'jwt' in authorizer and 'claims' in authorizer['jwt'] and 'sub' in authorizer['jwt']['claims']:
                user_id = authorizer['jwt']['claims']['sub']
        
        # Fallback for testing only - remove in production
        if not user_id:
            logger.warning("No user ID found in authorizer, using test user ID")
            user_id = 'test-user-id'
        
        logger.info(f"Using user ID: {user_id}")
        
        # Parse request body
        request_body = json.loads(event.get('body', '{}'))
        
        # Validate required fields
        required_fields = ['amount', 'description', 'date', 'type', 'category']
        for field in required_fields:
            if field not in request_body:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': True
                    },
                    'body': json.dumps({
                        'message': f'Missing required field: {field}'
                    })
                }
        
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb')
        table_name = os.environ.get('TRANSACTIONS_TABLE', 'Transactions')
        
        # Create transaction item
        transaction_id = str(uuid.uuid4())
        current_time = datetime.now(timezone.utc)
        timestamp = current_time.isoformat()
        
        # Use the date as provided by the client
        # The frontend should send dates in ISO format (YYYY-MM-DD)
        date_value = request_body['date']
        
        transaction_item = {
            'userId': user_id,
            'id': transaction_id,
            'amount': float(request_body['amount']),
            'description': request_body['description'],
            'date': date_value,
            'type': request_body['type'],
            'category': request_body['category'],
            'createdAt': timestamp,
            'updatedAt': timestamp
        }
        
        # Add optional fields if present
        if 'notes' in request_body:
            transaction_item['notes'] = request_body['notes']
        
        # Handle nested objects if present
        for key, value in request_body.items():
            if key not in transaction_item and isinstance(value, (dict, list)):
                transaction_item[key] = value
        
        # Serialize the item for DynamoDB
        serialized_item = serialize_to_dynamodb(transaction_item)
        
        # Save to DynamoDB
        dynamodb.put_item(
            TableName=table_name,
            Item=serialized_item
        )
        
        return {
            'statusCode': 201,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': 'Transaction created successfully',
                'transaction': transaction_item
            })
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
        logger.error(f"Error creating transaction: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Error creating transaction: {str(e)}'
            })
        } 
import json
import os
import boto3
import logging
from datetime import datetime
from botocore.exceptions import ClientError
from utils.dynamodb_utils import deserialize_from_dynamodb

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def format_date(date_str):
    """
    Ensure date is in YYYY-MM-DD format
    
    Args:
        date_str (str): Date string to format
        
    Returns:
        str: Formatted date string
    """
    try:
        # If it's already in ISO format with time, extract just the date part
        if 'T' in date_str:
            return date_str.split('T')[0]
        
        # If it's in YYYY-MM-DD format, return as is
        if len(date_str.split('-')) == 3:
            return date_str
        
        # Otherwise, try to parse and format
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%Y-%m-%d')
    except Exception as e:
        logger.warning(f"Error formatting date {date_str}: {str(e)}")
        # Return today's date as fallback
        return datetime.utcnow().strftime('%Y-%m-%d')

def lambda_handler(event, context):
    """
    Lambda function to retrieve transactions for a user.
    
    Args:
        event (dict): API Gateway Lambda Proxy Input Format
        context (object): Lambda Context runtime methods and attributes

    Returns:
        dict: API Gateway Lambda Proxy Output Format
    """
    logger.info(f"Get transactions request received: {json.dumps(event)}")
    
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
        
        # Initialize DynamoDB client
        dynamodb = boto3.client('dynamodb')
        table_name = os.environ.get('TRANSACTIONS_TABLE', 'Transactions')
        
        # Query transactions for the user
        response = dynamodb.query(
            TableName=table_name,
            KeyConditionExpression='userId = :userId',
            ExpressionAttributeValues={
                ':userId': {'S': user_id}
            }
        )
        
        # Deserialize the items from DynamoDB format
        raw_items = response.get('Items', [])
        transactions = [deserialize_from_dynamodb(item) for item in raw_items]
        
        # Format dates consistently
        for transaction in transactions:
            if 'date' in transaction and transaction['date']:
                transaction['date'] = format_date(transaction['date'])
            
            # Ensure amount is a number
            if 'amount' in transaction:
                try:
                    transaction['amount'] = float(transaction['amount'])
                except (ValueError, TypeError):
                    transaction['amount'] = 0
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(transactions)
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
        logger.error(f"Error getting transactions: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Error retrieving transactions: {str(e)}'
            })
        } 
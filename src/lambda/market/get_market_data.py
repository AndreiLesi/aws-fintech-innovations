import json
import os
import boto3
import logging
import random
from datetime import datetime, timedelta
from botocore.exceptions import ClientError

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    """
    Lambda function to retrieve market data.
    This is a mock implementation that generates random market data.
    In a real application, this would integrate with a financial data API.
    
    Args:
        event (dict): API Gateway Lambda Proxy Input Format
        context (object): Lambda Context runtime methods and attributes

    Returns:
        dict: API Gateway Lambda Proxy Output Format
    """
    logger.info(f"Get market data request received: {json.dumps(event)}")
    
    try:
        # Extract parameters
        query_params = event.get('queryStringParameters', {}) or {}
        time_range = query_params.get('timeRange', 'week')
        
        # Generate mock market data
        market_data = generate_mock_market_data(time_range)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps(market_data)
        }
    except Exception as e:
        logger.error(f"Error getting market data: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': True
            },
            'body': json.dumps({
                'message': f'Error retrieving market data: {str(e)}'
            })
        }

def generate_mock_market_data(time_range):
    """
    Generate mock market data for demonstration purposes.
    
    Args:
        time_range (str): Time range for data (day, week, month, year)
        
    Returns:
        dict: Mock market data
    """
    # Determine number of data points based on time range
    if time_range == 'day':
        num_points = 24
        date_format = '%H:%M'
        delta = timedelta(hours=1)
        start_date = datetime.now() - timedelta(hours=24)
    elif time_range == 'week':
        num_points = 7
        date_format = '%a'
        delta = timedelta(days=1)
        start_date = datetime.now() - timedelta(days=7)
    elif time_range == 'month':
        num_points = 30
        date_format = '%d'
        delta = timedelta(days=1)
        start_date = datetime.now() - timedelta(days=30)
    else:  # year
        num_points = 12
        date_format = '%b'
        delta = timedelta(days=30)
        start_date = datetime.now() - timedelta(days=365)
    
    # Generate trend data
    trends = []
    current_date = start_date
    base_value = 10000
    
    for i in range(num_points):
        # Random fluctuation between -2% and +2%
        change = random.uniform(-0.02, 0.02)
        value = base_value * (1 + change)
        base_value = value  # For next iteration
        
        trends.append({
            'date': current_date.strftime(date_format),
            'value': round(value, 2)
        })
        
        current_date += delta
    
    # Generate mock stock data
    stocks = [
        {
            'symbol': 'AAPL',
            'price': round(random.uniform(150, 180), 2),
            'change': round(random.uniform(-3, 5), 2)
        },
        {
            'symbol': 'MSFT',
            'price': round(random.uniform(280, 320), 2),
            'change': round(random.uniform(-3, 5), 2)
        },
        {
            'symbol': 'GOOGL',
            'price': round(random.uniform(120, 140), 2),
            'change': round(random.uniform(-3, 5), 2)
        },
        {
            'symbol': 'AMZN',
            'price': round(random.uniform(130, 150), 2),
            'change': round(random.uniform(-3, 5), 2)
        },
        {
            'symbol': 'META',
            'price': round(random.uniform(300, 350), 2),
            'change': round(random.uniform(-3, 5), 2)
        }
    ]
    
    return {
        'trends': trends,
        'stocks': stocks
    } 
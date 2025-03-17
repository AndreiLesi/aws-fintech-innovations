"""
Utility functions for Lambda functions.
"""

from .dynamodb_utils import serialize_to_dynamodb, deserialize_from_dynamodb

__all__ = ['serialize_to_dynamodb', 'deserialize_from_dynamodb'] 
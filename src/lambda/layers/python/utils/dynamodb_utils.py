import decimal
from boto3.dynamodb.types import TypeSerializer, TypeDeserializer

serializer = TypeSerializer()
deserializer = TypeDeserializer()

def serialize_to_dynamodb(data):
    """
    Recursively serializes a Python dictionary to a DynamoDB-compatible format.
    - Converts `float` to `Decimal`
    - Handles nested dicts and lists correctly
    """
    def _serialize(value):
        if isinstance(value, float):
            return decimal.Decimal(str(value))  # Convert float to Decimal
        elif isinstance(value, list):
            return [_serialize(v) for v in value]  # Recursively serialize lists
        elif isinstance(value, dict):
            return {k: _serialize(v) for k, v in value.items()}  # Recursively serialize dicts
        return value  # Return supported types directly

    serialized_data = {k: serializer.serialize(_serialize(v)) for k, v in data.items()}
    return serialized_data

def deserialize_from_dynamodb(dynamodb_data):
    """
    Recursively deserializes a DynamoDB item back into a normal Python dictionary.
    - Converts `Decimal` back to `float` for JSON compatibility
    """
    deserialized_data = {k: deserializer.deserialize(v) for k, v in dynamodb_data.items()}

    def _convert_decimals(obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)  # Convert Decimal → float
        elif isinstance(obj, list):
            return [_convert_decimals(i) for i in obj]
        elif isinstance(obj, dict):
            return {k: _convert_decimals(v) for k, v in obj.items()}
        return obj

    return _convert_decimals(deserialized_data) 
import json
import boto3

# Initialize DynamoDB resource
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
table = dynamodb.Table('visitor-count-terraform2-v2')

def lambda_handler(event, context):

        # Retrieve current visitor count from DynamoDB
    response = table.get_item(
        Key={'id': '1', 'visitors': '1'})
        
    # Check if 'views' key exists in the response
    item = response.get("Item", {})
    visits = item.get("visits", 0)
        
    # Increment visitor count
    visits = visits + 1
        
    # Update DynamoDB with new visitor count
    table.put_item(Item={"id": "1", "visitors": "1", "visits": visits})
        
    # Return the updated visitor count
    return visits

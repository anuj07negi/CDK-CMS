import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export async function getCustomer(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const id = event.queryStringParameters.id;
  const { Item } = await ddbClient.send(new GetItemCommand({
    TableName: process.env.TABLE_NAME,
    Key: {
      'id': {
        S: id
      }
    }
  }));
  return {
    statusCode: 200,
    body: JSON.stringify(Item ? unmarshall(Item) : {})
  }
}
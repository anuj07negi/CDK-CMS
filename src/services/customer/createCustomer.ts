import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { marshall } from "@aws-sdk/util-dynamodb";


export async function createCustomer(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const item = JSON.parse(event.body);
  item.id = v4();
  await ddbClient.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: marshall(item)
  }))
  return {
    statusCode: 201,
    body: JSON.stringify({ mesage: 'succesfully created', id: item.id })
  }
}
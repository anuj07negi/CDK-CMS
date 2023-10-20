import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { v4 } from "uuid";
import { marshall } from "@aws-sdk/util-dynamodb";


export async function createCustomer(event: APIGatewayProxyEvent, ddbClient: DynamoDBClient): Promise<APIGatewayProxyResult> {
  const item = JSON.parse(event.body);
  let isAdmin = false;
  const groups = event.requestContext.authorizer.claims['cognito:groups']
  if(groups){
    isAdmin = (groups as string).includes('admins')
  }
  if(!isAdmin){
    return {
      statusCode: 401,
      body:JSON.stringify({
        message: 'not admin'
      })
    }
  }
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
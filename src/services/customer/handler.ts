import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { createCustomer } from "./createCustomer";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { getCustomer } from "./getCustomer";

const ddbClient = new DynamoDBClient({})
async function handler(event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> {
  try {
    switch (event.httpMethod) {
      case 'POST':
        return await createCustomer(event, ddbClient);
      case 'GET':
        return await getCustomer(event, ddbClient)
    }
  } catch (error) {
    console.log(error)
    return {
      statusCode: 500,
      body: 'Internal Error'
    }
  }
}
export { handler }

import { App } from "aws-cdk-lib";
import { LambdaStack } from "./stacks/lambda.stack";
import { ApiStack } from "./stacks/api.stack";
import { DataStack } from "./stacks/data.stack";

const app = new App();

const dataStack = new DataStack(app, 'DataStack')
const lambdaStack = new LambdaStack(app, 'LambdaStack', {
  cmsTable: dataStack.cmsTable
});
const apiStack = new ApiStack(app, 'ApiStack', {
  customerLambdaIntegration: lambdaStack.customerLambdaIntegration,
  // productLambdaIntegration: lambdaStack.productLambdaIntegration,
  // orderLambdaIntegration: lambdaStack.orderLambdaIntegration,
});

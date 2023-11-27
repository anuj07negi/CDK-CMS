import { Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaStack } from "../stacks/lambda.stack";
import { DataStack } from "../stacks/data.stack";
import { ApiStack } from "../stacks/api.stack";
import { AuthStack } from "../stacks/auth.stack";

export class PipelineAppDev extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    const dataStack = new DataStack(this, 'DataStack');
    const lambdaStack = new LambdaStack(this, 'LambdaStack', {
      cmsTable: dataStack.cmsTable
    });
    const authStack = new AuthStack(this, 'AuthStack');
    const apiStack = new ApiStack(this, 'ApiStack', {
      customerLambdaIntegration: lambdaStack.customerLambdaIntegration,
      // productLambdaIntegration: lambdaStack.productLambdaIntegration,
      // orderLambdaIntegration: lambdaStack.orderLambdaIntegration,
      userPool: authStack.userPool
    });
  }
}
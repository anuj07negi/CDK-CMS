import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Product } from "aws-cdk-lib/aws-servicecatalog";
import { Construct } from "constructs";
import { join } from "path";

interface LambdaStackProps  extends StackProps{
  cmsTable: ITable
}

export class LambdaStack extends Stack{
  public readonly customerLambdaIntegration: LambdaIntegration;
  // public readonly productLambdaIntegration: LambdaIntegration;
  // public readonly orderLambdaIntegration: LambdaIntegration;

  constructor(scope: Construct, id: string, props?: LambdaStackProps){
    super(scope, id, props);
    
    const customerLambda = new NodejsFunction(this, 'customerLambda', {
      runtime: Runtime.NODEJS_18_X,
      handler: 'handler',
      entry: (join(__dirname, '..', '..', 'services', 'customer', 'handler.ts')),
      environment:{
        TABLE_NAME: props.cmsTable.tableName
      }
    });
    customerLambda.addToRolePolicy(new PolicyStatement({
      effect: Effect.ALLOW,
      resources:[props.cmsTable.tableArn],
      actions:[
        'dynamodb:PutItem',
        'dynamodb:GetItem',
        'dynamodb:UpdateItem',
        'dynamodb:DeleteItem'
      ]
    }));

    // const productLambda = new NodejsFunction(this, 'productLambda', {
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'handler',
    //   entry: (join(__dirname, '..', '..', 'services', 'product', 'handler.ts')),
    //   environment:{
    //     TABLE_NAME: props.cmsTable.tableName
    //   }
    // })
    // productLambda.addToRolePolicy(new PolicyStatement({
    //   effect: Effect.ALLOW,
    //   resources:[props.cmsTable.tableArn],
    //   actions:[
    //     'dynamodb:PutItem',
    //     'dynamodb:GetItem',
    //     'dynamodb:UpdateItem',
    //     'dynamodb:DeleteItem'
    //   ]
    // }))



    // const orderLambda = new NodejsFunction(this, 'orderLambda', {
    //   runtime: Runtime.NODEJS_18_X,
    //   handler: 'handler',
    //   entry: (join(__dirname, '..', '..', 'services', 'order', 'handler.ts')),
    //   environment:{
    //     TABLE_NAME: props.cmsTable.tableName
    //   }
    // })
    // orderLambda.addToRolePolicy(new PolicyStatement({
    //   effect: Effect.ALLOW,
    //   resources:[props.cmsTable.tableArn],
    //   actions:[
    //     'dynamodb:PutItem',
    //     'dynamodb:GetItem',
    //     'dynamodb:UpdateItem',
    //     'dynamodb:DeleteItem'
    //   ]
    // }))

    this.customerLambdaIntegration = new LambdaIntegration(customerLambda)
    // this.productLambdaIntegration = new LambdaIntegration(productLambda)
    // this.orderLambdaIntegration = new LambdaIntegration(orderLambda)
  }

}








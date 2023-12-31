import { Stack, StackProps } from "aws-cdk-lib";
import { AuthorizationType, CognitoUserPoolsAuthorizer, LambdaIntegration, MethodOptions, RestApi } from "aws-cdk-lib/aws-apigateway";
import { IUserPool } from "aws-cdk-lib/aws-cognito";
import { Construct } from "constructs";

interface ApiStackProps extends StackProps{
  userPool: IUserPool,
  customerLambdaIntegration: LambdaIntegration
  // productLambdaIntegration: LambdaIntegration
  // orderLambdaIntegration: LambdaIntegration
}

export class ApiStack extends Stack{
  constructor(scope: Construct, id: string, props: ApiStackProps){
    super(scope, id, props);
    

    const customerAPI =  new RestApi( this, 'CustomerAPI');
    const authorizer = new CognitoUserPoolsAuthorizer(this, 'CMSApiAuthorizer', {
      cognitoUserPools: [props.userPool],
      identitySource: 'method.request.header.Authorization'
    });
    authorizer._attachToApi(customerAPI);
    const optionWithAuth: MethodOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.authorizerId
      }
    };
    const customerResource = customerAPI.root.addResource('customer');
    customerResource.addMethod('POST', props.customerLambdaIntegration, optionWithAuth);
    customerResource.addMethod('GET', props.customerLambdaIntegration, optionWithAuth);
    customerResource.addMethod('PUT', props.customerLambdaIntegration, optionWithAuth);
    customerResource.addMethod('DELETE', props.customerLambdaIntegration, optionWithAuth);


    // const productAPI =  new RestApi( this, 'ProductAPI');
    // const productResource = productAPI.root.addResource('product');
    // productResource.addMethod('POST', props.productLambdaIntegration)
    // productResource.addMethod('GET', props.productLambdaIntegration)
    // productResource.addMethod('PUT', props.productLambdaIntegration)
    // productResource.addMethod('DELETE', props.productLambdaIntegration)

    // const orderAPI =  new RestApi( this, 'OrderAPI');
    // const orderResource = orderAPI.root.addResource('order');
    // orderResource.addMethod('POST', props.orderLambdaIntegration)
    // orderResource.addMethod('GET', props.orderLambdaIntegration)
    // orderResource.addMethod('PUT', props.orderLambdaIntegration)
    // orderResource.addMethod('DELETE', props.orderLambdaIntegration)
  }

}
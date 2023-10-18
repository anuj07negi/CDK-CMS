import { App } from "aws-cdk-lib";
import { LambdaStack } from "./stacks/lambda.stack";
import { ApiStack } from "./stacks/api.stack";
import { DataStack } from "./stacks/data.stack";
import { CmsCICDStack } from "./stacks/cicd.stack";

const app = new App();

new CmsCICDStack(app, 'CmsCICDStack')
app.synth();

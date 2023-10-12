import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class CmsCICDStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)
    new CodePipeline(this, 'CMSPipeline', {
      pipelineName: 'CMSPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('anuj07negi/CDK-CMS', 'main'),
        installCommands: ['npm i -g npm@latest'],
        commands: [
          'npx ci',
          'npx cdk synth'
        ]
      })
    })
  }
}


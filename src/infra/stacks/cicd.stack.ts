import { Stack, StackProps } from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineAppDev } from "../stages/app.dev.pipeline";

export class CmsCICDStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const pipeline = new CodePipeline(this, 'CMSPipeline', {
      pipelineName: 'CMSPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('anuj07negi/CDK-CMS', 'main'),
        commands: [
          'npx ci',
          'npx cdk synth'
        ]
      })
    });
    pipeline.addStage(new PipelineAppDev(this,  'AppDev' ));
  }
}


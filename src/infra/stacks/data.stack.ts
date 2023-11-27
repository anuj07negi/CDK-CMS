import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib";
import { AttributeType, ITable, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class DataStack extends  Stack{
  public readonly cmsTable: ITable;

  constructor(scope: Construct, id: string, props?: StackProps){
    super(scope, id, props);
    
    const cmsTable = new Table(this, 'CMSTable', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'CMSTable',
    });

    this.cmsTable = cmsTable;
  }
}
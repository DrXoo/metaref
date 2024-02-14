import * as cdk from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new Table(this, 'MetaRefTable', {
      partitionKey: { name: 'pk', type: AttributeType.STRING },
      sortKey: { name: 'sk', type: AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Only for testing purposes. Be cautious in production.
    });

    table.addLocalSecondaryIndex({
      indexName: 'GameIdIndex',
      sortKey: { name: 'GameId', type: AttributeType.STRING },
    });
  }
}

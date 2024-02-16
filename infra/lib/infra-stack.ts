import * as cdk from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Queue } from 'aws-cdk-lib/aws-sqs';
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

    const queue = new Queue(this, 'GameNameQueue', {
      visibilityTimeout: cdk.Duration.seconds(30), // adjust as needed,
      fifo: true
    });

    const metarefLambda = new Function(this, 'MetarefLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromAsset('./../metaref-lambda/'),
      environment: {
        TOKEN: process.env.TOKEN!,
        DB_TABLE_NAME: process.env.DB_TABLE_NAME!,
        REGION: process.env.REGION!
      },
    });

    const scrapperLambda = new Function(this, 'ScrapperLambda', {
      runtime: Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: Code.fromAsset('./../scrapper-lambda/'),
      environment: {
        DB_TABLE_NAME: process.env.DB_TABLE_NAME!,
        REGION: process.env.REGION!
      },
    });

    // Grant the Lambda function permissions to read from the SQS queue
    queue.grantConsumeMessages(scrapperLambda);
    queue.grantSendMessages(metarefLambda);

    table.grantReadWriteData(metarefLambda);
    table.grantReadWriteData(scrapperLambda);

    // Attach the SQS queue as an event source for the Lambda function
    scrapperLambda.addEventSource(new SqsEventSource(queue));
  }
}

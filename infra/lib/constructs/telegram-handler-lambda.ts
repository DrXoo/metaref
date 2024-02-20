import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Queue } from "aws-cdk-lib/aws-sqs";

export interface TelegramHandlerLambdaProps {
    queue: Queue
    table: Table
}

export class TelegramHandlerLambda extends Construct {

    public lambda: Function;

    constructor(scope: Construct, props: TelegramHandlerLambdaProps) {
        super(scope, 'TelagramHandler');

        this.lambda = new Function(scope, 'MetaRefBotLambda', {
            functionName: 'MetaRefBotLambda',
            runtime: Runtime.NODEJS_20_X,
            handler: 'index.metarefBot',
            code: Code.fromAsset('./../metaref-lambda/dist'),
            environment: {
              TOKEN: process.env.TOKEN!,
              DB_TABLE_NAME: props.table.tableName!,
              REGION: process.env.REGION!,
              QUEUE_URL: props.queue.queueUrl
            },
          });

        props.queue.grantSendMessages(this.lambda);
        props.table.grantReadWriteData(this.lambda);
    }
}
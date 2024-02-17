import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Duration } from "aws-cdk-lib";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";

export interface WebScrapperLambdaProps {
    queue: Queue
    table: Table
}

export class WebScrapperLambda extends Construct {

    public lambda: Function;

    constructor(scope: Construct, props: WebScrapperLambdaProps) {
        super(scope, 'WebScrapper');

        this.lambda = new Function(scope, 'WebScrapperLambda', {
            functionName: 'WebScrapperLambda',
            runtime: Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: Code.fromAsset('./../scrapper-lambda/'),
            timeout: Duration.seconds(15),
            environment: {
              DB_TABLE_NAME: process.env.DB_TABLE_NAME!,
              REGION: process.env.REGION!
            },
          });

        props.queue.grantConsumeMessages(this.lambda);
        props.table.grantReadWriteData(this.lambda);

        this.lambda.addEventSource(new SqsEventSource(props.queue));
    }
}
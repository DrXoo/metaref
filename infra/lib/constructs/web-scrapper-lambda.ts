import { Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { Code, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { Duration } from "aws-cdk-lib";
import { Rule, Schedule } from "aws-cdk-lib/aws-events";
import { LambdaFunction } from "aws-cdk-lib/aws-events-targets";

export interface WebScrapperLambdaProps {
    table: Table
}

export class WebScrapperLambda extends Construct {

    constructor(scope: Construct, props: WebScrapperLambdaProps) {
        super(scope, 'WebScrapper');


        // Create an Event Rule with a cron expression
        const rule = new Rule(this, 'CallScrapperLambdaSchedule', {
          ruleName: 'CallScrapperLambdaSchedule',
          schedule: Schedule.expression('rate(1 minute)'),
        });

        const lambda = new Function(scope, 'WebScrapperLambda', {
            functionName: 'WebScrapperLambda',
            runtime: Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: Code.fromAsset('./../scrapper-lambda/'),
            timeout: Duration.seconds(15),
            environment: {
              DB_TABLE_NAME: props.table.tableName!,
              REGION: process.env.REGION!,
              NUM_PENDING_GAMES: '1'
            },
          });

        // Add the Lambda function as a target for the Event Rule
        rule.addTarget(new LambdaFunction(lambda));

        props.table.grantReadWriteData(lambda);
    }
}
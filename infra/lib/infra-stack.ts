import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';
import { MetaRefDb } from './constructs/meta-ref-db';
import { TelegramHandlerLambda } from './constructs/telegram-handler-lambda';
import { WebScrapperLambda } from './constructs/web-scrapper-lambda';
import { MetaRefApi } from './constructs/meta-ref-api';

export class InfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const db = new MetaRefDb(this);

    const queue = new Queue(this, 'GameNameQueue', {
      queueName: 'GameNameQueue.fifo',
      visibilityTimeout: Duration.seconds(30), // adjust as needed,
      fifo: true,
      deliveryDelay: Duration.minutes(1)
    });

    const telegramHandler = new TelegramHandlerLambda(this, { table: db.table, queue });

    new WebScrapperLambda(this, { table: db.table, queue });

    new MetaRefApi(this, { telegramHandlerLambda: telegramHandler.lambda });
  }
}

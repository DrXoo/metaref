import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";

// a client can be shared by different commands.
const client = new SQSClient({ region: process.env.REGION });


export async function sendUrls(gameName: string): Promise<void> {
    const command = new SendMessageBatchCommand({
        QueueUrl: process.env.QUEUE_URL,
        Entries: [ { MessageBody: 'url', Id: "1"}]
    });

    var response = await client.send(command);

    const failed = response.Failed;
}
  
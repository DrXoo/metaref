import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";

// a client can be shared by different commands.
const client = new SQSClient({ region: process.env.REGION });

export async function sendGameUrls(gameUrls: string[]): Promise<void> {
    const command = new SendMessageBatchCommand({
        QueueUrl: process.env.QUEUE_URL,
        Entries: gameUrls.map((value, index) => { return  { MessageBody: value, Id: index.toString() } })
    });

    var response = await client.send(command);

    const failed = response.Failed;
}
  
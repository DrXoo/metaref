import { SQSClient, SendMessageBatchCommand } from "@aws-sdk/client-sqs";
import { v4 as uuidv4 } from 'uuid';

// a client can be shared by different commands.
const client = new SQSClient({ region: process.env.REGION });

export async function sendGameUrls(gameUrls: string[]): Promise<void> {
    const command = new SendMessageBatchCommand({
        QueueUrl: process.env.QUEUE_URL,
        Entries: gameUrls.map((value, index) => { return  { 
            MessageBody: value, 
            Id: index.toString(), 
            MessageGroupId: uuidv4(), 
            MessageDeduplicationId: uuidv4() 
        } }) 
    });

    var response = await client.send(command);

    const failed = response.Failed;
}
  
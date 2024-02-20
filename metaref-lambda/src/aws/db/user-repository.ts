import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { User } from "../types";

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME!
  
export async function getRandomUser(): Promise<User | null> {
    const result = await client.query({
        TableName: tableName,
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
        ':pk': { S: 'Users' },
        },
        ProjectionExpression: 'sk',
    })
    const users = result.Items?.map(x => { return {
        userName: x['sk'].S
    } as User});

    if (users == null || users.length === 0) {
        return null;
    }

    // Select a random user
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
}

export async function createUser(userName: string) : Promise<boolean> {
    var existingUser = await getUser(userName);

    if(existingUser!=null) {
        return false;
    }

    await client.putItem({
        TableName: tableName,
        Item: {
            pk: { S: 'Users'},
            sk: { S: userName }
        }
    });

    return true;
}

async function getUser(userName: string): Promise<User | null> {
    const result = await client.getItem({
        TableName: tableName,
        Key: {
            'pk': { S: 'Users' },
            'sk': { S: userName }
        },
        ConsistentRead: true
    })

    if(result.Item == undefined) {
        return null;
    }

    return {
        userName: result.Item['sk'].S!
    } as User
}
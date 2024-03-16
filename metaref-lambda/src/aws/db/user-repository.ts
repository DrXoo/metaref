import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { User } from "../types";

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME!
  
export async function getAllUsers(): Promise<User[]> {
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
        return [];
    }

    return users;
}

export async function createUser(userName: string, externalUserId: number) : Promise<boolean> {
    var existingUser = await getUser(userName);

    if(existingUser!=null) {
        return false;
    }

    await client.putItem({
        TableName: tableName,
        Item: {
            pk: { S: 'Users'},
            sk: { S: userName },
            ExternalUserId : { N: externalUserId.toString() }
        }
    });

    return true;
}

export async function getUserByExternalUserId(externalUserId: number) : Promise<User | null> {
    const response = await client.query({
        TableName: tableName,
        IndexName: 'ExternalUserIdIndex',
        KeyConditionExpression: 'pk = :pk AND ExternalUserId = :externalUserId',
        ExpressionAttributeValues: {
            ':pk': { S: 'Users' },
            ':externalUserId': { N: externalUserId.toString() },
        }
    });

    var users = response.Items?.map(x => { return {
        userName: x['sk'].S
    } as User});

    if (users == null || users.length === 0) {
        return null;
    }

    return users[0]
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
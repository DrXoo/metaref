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
        userId: x['sk'].S
    } as User});

    if (users == null || users.length === 0) {
        return null;
    }

    // Select a random user
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex];
}

export async function getUser(userName: string): Promise<User | null> {
    const result = await client.query({
        TableName: tableName,
        KeyConditionExpression: 'pk= :pk AND sk = :sk',
        ExpressionAttributeValues: {
            ':pk' : { S: 'Users' },
            ':sk': { S: userName } 
        },
        ProjectionExpression: 'sk'
    });
    
    const item = result.Items?.at(0)

    if(item == null){
        return null;
    }

    return {
        userId: item['sk'].S!
    } as User
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
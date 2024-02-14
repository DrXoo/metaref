import { DynamoDB } from "@aws-sdk/client-dynamodb";

const client = new DynamoDB({ region: process.env.AWS_REGION });
const tableName = process.env.DB_TABLE_NAME!

interface Game {
    gameId: string;
    gameName: string;
    userId: string;
}
  
interface User {
    userId: string;
}

export async function searchGame(gameName: string): Promise<Game[]> {
    const result = await client.query({
        TableName: tableName,
        KeyConditionExpression: 'pk= :pk AND begins_with(sk, :skPrefix)',
        ExpressionAttributeValues: {
            ':pk' : { S: 'Games'},
            ':skPrefix': { S: gameName}
        },
        ProjectionExpression: 'sk, GameId, GameName',
    });

    return result.Items!.map(x => {
        return {
            gameId: x['GameId'].S,
            gameName: x['GameName'].S,
            userId: x['sk'].S!.split('_')[1]
        } as Game
    });
}
  
export async function getGame(gameId: string): Promise<Game | null> {
    const result = await client.query({
        TableName: tableName,
        IndexName: 'GameIdIndex',
        KeyConditionExpression: 'pk= :pk AND GameId = :gameId',
        ExpressionAttributeValues: {
            ':pk' : { S: 'Games' },
            ':gameId': { S: gameId } 
        },
        ProjectionExpression: 'sk, GameId, GameName'
    })
    const item = result.Items?.at(0)

    if(item == null){
        return null;
    }

    return {
        gameId: item['GameId'].S,
        gameName: item['GameName'].S,
        userId: item['sk'].S!.split('_')[1]
    } as Game
}
  
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
    })
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

    console.log(existingUser);

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
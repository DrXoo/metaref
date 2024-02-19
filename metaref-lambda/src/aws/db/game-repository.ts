import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Game, User } from "../types";

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME!


export async function searchGame(gameName: string): Promise<Game[]> {
    const result = await client.query({
        TableName: tableName,
        KeyConditionExpression: 'pk= :pk AND begins_with(sk, :gameName)',
        ExpressionAttributeValues: {
            ':pk' : { S: 'UserGame'},
            ':gameName': { S: gameName}
        },
        ProjectionExpression: 'sk, GameId',
    });

    return result.Items!.map(x => {
        return {
            gameId: x['GameId'].S,
            gameName: x['sk'].S,
        } as Game
    });
}
  
export async function getGameByName(gameName: string): Promise<Game | null> {
    const result = await client.getItem({
        TableName: tableName,
        Key: {
            'pk' : { S: 'Games'},
            'sk': { S: gameName}
        },
        ProjectionExpression: 'sk, GameId'
    })

    if(result.Item == undefined){
        return null;
    }

    return {
        gameId: result.Item['GameId'].S,
        gameName: result.Item['sk'].S,
    } as Game
}

export async function getGamesByNamesBatch(gameNames: string[]) : Promise<Game[]> {
    const result = await client.batchGetItem({
        RequestItems: {
            tableName: {
                Keys: gameNames.map(game => {
                    return { 
                        'pk': { S: 'Games'},
                        'sk': { S: game }
                    }
                })
            }
        }
    });

    if(result.Responses == undefined)
        return [];

    return result.Responses[0].map(item => {
        return {
            gameId: item['GameId'].S,
            gameName: item['sk'].S,
        } as Game
    })
}

export async function getUsersForGame(gameId: string) : Promise<User[]> {
    const result = await client.query({
        TableName: tableName,
        KeyConditionExpression: 'pk= :pk AND begins_with(sk, :gameId)',
        ExpressionAttributeValues: {
            ':pk' : { S: 'UserGame'},
            ':gameName': { S: gameId}
        },
        ProjectionExpression: 'sk',
    });

    if(!result.Items){
        return [];
    }

    return result.Items!.map(x => {
        return { userId: x['sk'].S?.split('_')[1]! }
    })
}

export async function createGame(gameName: string, gameId: string) : Promise<boolean> {
    try {
        await client.putItem({
            TableName: tableName,
            Item: {
                'pk': { S: 'Games' },
                'sk': { S: gameName },
                'gameId': { S: gameId}
            }
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export async function assignUser(gameId: string, userName: string) {
    try {
        await client.putItem({
            TableName: tableName,
            Item: {
                'pk': { S: 'UserGame' },
                'sk': { S: `${gameId}_${userName}` }
            }
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
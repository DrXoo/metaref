import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { Game, GameUser, User } from "../types";

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME!


export async function searchGame(gameName: string): Promise<Game[]> {
    const result = await client.query({
        TableName: tableName,
        IndexName: 'GameNameIndex',
        KeyConditionExpression: 'pk= :pk AND begins_with(GameName, :gameName)',
        ExpressionAttributeValues: {
            ':pk' : { S: 'Games'},
            ':gameName': { S: gameName}
        },
        ProjectionExpression: 'sk, GameName',
    });

    return result.Items!.map(x => {
        return {
            gameId: x['sk'].S,
            gameName: x['GameName'].S,
        } as Game
    });
}

export async function getGamesByIdsBatch(gameIds: string[]) : Promise<Game[]> {
    const result = await client.batchGetItem({
        RequestItems: {
            tableName: {
                Keys: gameIds.map(game => {
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
            gameId: item['sk'].S,
            gameName: item['GameName'].S,
        } as Game
    })
}

export async function getUsersForGame(gameId: string) : Promise<User[]> {
    const result = await client.query({
        TableName: tableName,
        KeyConditionExpression: 'pk= :pk AND begins_with(sk, :gameId)',
        ExpressionAttributeValues: {
            ':pk' : { S: 'UserGame'},
            ':gameId': { S: gameId}
        },
        ProjectionExpression: 'sk',
    });

    if(!result.Items){
        return [];
    }

    return result.Items!.map(x => {
        return { userName: x['sk'].S?.split('_')[1]! }
    })
}

export async function createGame(gameName: string, gameId: string) : Promise<boolean> {
    try {
        await client.putItem({
            TableName: tableName,
            Item: {
                'pk': { S: 'Games' },
                'sk': { S: gameId },
                'GameName': { S: gameName}
            }
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }

}

export async function assignUsers( gameUsers: GameUser[] ) {
    try {
        
        await client.batchWriteItem({
            RequestItems: {
                tableName: gameUsers.map(x => {
                    return {
                        PutRequest: {
                            Item: {
                                'pk': { S: 'UserGame' },
                                'sk': { S: `${x.gameId}_${x.userName}` }
                            }
                        }
                    }
                })
            }
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
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
        ProjectionExpression: 'sk, RawGameName',
    });

    if(result.Items == undefined || result.Items.length == 0) {
        return [];
    }

    return result.Items!.map(x => {
        return {
            gameId: x['sk'].S,
            gameName: x['RawGameName'].S,
        } as Game
    });
}

export async function getGamesByIdsBatch(gameIds: string[]) : Promise<Game[]> {
    try {
        const result = await client.batchGetItem({
            RequestItems: {
                [tableName]: {
                    Keys: gameIds.map(game => {
                        return { 
                            'pk': { S: 'Games'},
                            'sk': { S: game }
                        }
                    })
                }
            }
        });
        if(result.Responses == undefined) {
            return [];
        }
        
        return result.Responses.MetaRef.map(item => {
            return {
                gameId: item['sk'].S,
                gameName: item['GameName'].S,
            } as Game
        })
    } catch (error) {
        console.log(error);
        return [];
    }
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

export async function createPendingGame(pendingGames: {gameId: string, userName: string, url: string}[]) : Promise<boolean> {
    try {
        await client.batchWriteItem({
            RequestItems: {
                [tableName]: pendingGames.map(x => {
                    return {
                        PutRequest: {
                            Item: {
                                'pk': { S: 'Pending' },
                                'sk': { S: `${x.url}`},
                                'GameId': { S: x.gameId },
                                'UserName': { S: x.userName},
                                'GameUrl': { S: x.url },
                                'CreatedOn': { S: new Date().toISOString() }
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

export async function assignUsers( gameUsers: GameUser[] ) {
    if(gameUsers.length == 0){
        return;
    }
    
    try {
        await client.batchWriteItem({
            RequestItems: {
                [tableName]: gameUsers.map(x => {
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
    } catch (error) {
        console.log(error);
    }
}
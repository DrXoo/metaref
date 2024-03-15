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

export async function getAllGamesByUser(externalUserId: number): Promise<Game[]> {
    const response = await client.query({
        TableName: tableName,
        IndexName: 'ExternalUserIdIndex',
        KeyConditionExpression: 'pk= :pk AND ExternalUserId = :externalUserId',
        ExpressionAttributeValues: {
            ':pk' : { S: 'UserGame' },
            ':externalUserId': { N: externalUserId.toString() }
        },
        ProjectionExpression: 'sk',
    });

    if(response.Items == undefined || response.Items.length == 0) {
        return [];
    }

    const gameIds = response.Items.map(x => x['sk'].S?.split('_')[0]!);
    const batchLength = 20;
    let result : Game[] = [];
    for (let i = 0; i < gameIds.length; i += batchLength) {
        const groupGameIds = gameIds.slice(i, i + batchLength);

        const games = await getGamesByIdsBatch(groupGameIds);
        result.push(...games);
    }

    return result;
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
                rawGameName: item['RawGameName'].S
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

export async function createPendingGame(pendingGames: {gameId: string, userName: string, url: string}[], telegramUserId: number) : Promise<boolean> {
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
                                'CreatedOn': { S: new Date().toISOString() },
                                'TelegramUserId': { N: telegramUserId.toString() }
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

export async function assignUsers( gameUsers: GameUser[], externalUserId : number ) {
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
                                'sk': { S: `${x.gameId}_${x.userName}` },
                                'ExternalUserId':  { N: externalUserId.toString() }
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
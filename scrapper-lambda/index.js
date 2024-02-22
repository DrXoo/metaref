require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME

exports.handler = async (event, context, callback) => {
    var pendingGames = await getPendingGames();

    if(pendingGames.length > 0) {
        console.log(`Found ${pendingGames.length} games`);
        var games = [];

        for (const data of pendingGames) {
            console.log(`URL to handle: ${data.url}`);
            const gameName = await extractGameName(data.url);
            console.log(`GameName: ${gameName}`)
            games.push({
                gameId: data.gameId,
                gameName: normalizeGameNameText(gameName),
                rawGameName: gameName,
                userName: data.userName,
                createdOn: data.createdOn
            });
        }
    
        if(games.length > 0) {
            await createGames(games);
            await assignUsers(games);
        }
    
        await deletePendingGames(pendingGames);
    } else {
        console.log("No Pending Games. Skipping");
    }
}

async function getPendingGames() {
    const params = {
        TableName: tableName, 
        KeyConditionExpression: 'pk = :pk',
        ExpressionAttributeValues: {
        ':pk': { S: 'Pending' },
        },
        ProjectionExpression: 'GameId, GameUrl, UserName, CreatedOn',
        ScanIndexForward: true, // Order by CreatedOn in ascending order
        Limit: 5, // Take 5 elements only
    };
    
    try {
        const response = await client.query(params);

        if(!response.Items || response.Items.length === 0) {
            return [];
        } 

        return response.Items.map(x => {
            return {
                gameId: x['GameId'].S,
                userName: x['UserName'].S,
                url: x['GameUrl'].S,
                createdOn: x['CreatedOn']
            }
        })
    } catch (error) {
        console.error('Error querying DynamoDB:', error);
    }
  }
  

function normalizeGameNameText(rawText) {
    return rawText.trim().toLowerCase().replace(/\s/g, '');
}

async function extractGameName(url) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $('title').text();
    return title.split('off')[1].split('|')[0].trim();
}

async function createGames(games) {
    try {
        await client.batchWriteItem({
            RequestItems: {
                [tableName]: games.map(x => {
                    return {
                        PutRequest: {
                            Item: {
                                'pk': { S: 'Games' },
                                'sk': { S: x.gameId },
                                'GameName': { S: x.gameName},
                                'RawGameName': { S: x.rawGameName }
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

async function assignUsers( gameUsers ) {
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

async function deletePendingGames(games) {
    try {
        await client.batchWriteItem({
            RequestItems: {
                [tableName]: games.map(x => {
                    return {
                        DeleteRequest: {
                            Key: {
                                pk: { S: 'Pending' },
                                sk: { S: x.url}
                            },
                        }
                    }
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}

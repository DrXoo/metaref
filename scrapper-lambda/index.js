require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const { DynamoDB } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDB({ region: process.env.REGION });
const tableName = process.env.DB_TABLE_NAME

exports.handler = async (event, context, callback) => {
    var gamesData = await event.Records.map((record) => JSON.parse(record.body));
    
    var games = [];

    for (const data of gamesData) {
        const gameName = await extractGameName(data.url);
        games.push({
            gameId: data.gameId,
            gameName,
            userName: data.userName
        });
    }


    await createGames(games);
    await assignUsers(games);
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
                                'GameName': { S: x.gameName}
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
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

import 'dotenv/config'
const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context, callback) => {
    var urls = await event.Records.map((record) => record.body.gameUrl);
    
    var games = [];

    for (const url of urls) {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const gameName = extractGameName($);
        const gameInfo = parseGameLink(url);

        games.push({
            gameId: gameInfo.gameId,
            gameName,
            userName: gameInfo.userName
        })
    }

    const client = new DynamoDB({ region: process.env.REGION });
    const tableName = process.env.DB_TABLE_NAME

    await createGames(games);
    await assignUsers(games);
}

function extractGameName(cheerioRoot) {
    const title = cheerioRoot('title').text();
    return title.split('off')[1].split('|')[0].trim();
}

function parseGameLink(link)  {
    // Define a regular expression to match the desired values
    const regex = /\/appreferrals\/([^\/]+)\/([^\/]+)\/\?/;

    // Use the regular expression to match the values in the URL
    const match = link.match(regex);

    // Extract the values from the match
    const userName = match ? match[1] : undefined;
    const gameId = match ? match[2] : '';

    return { userName, gameId: normalizeGameNameText(gameId) };
}

function normalizeGameNameText(rawText){
    return rawText.trim().toLowerCase().replace(/\s/g, '');
}

async function createGames(games) {
    try {
        await client.batchWriteItem({
            RequestItems: {
                tableName: games.map(x => {
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

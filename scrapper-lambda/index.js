require('dotenv').config()
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./db')

exports.handler = async (event, context, callback) => {
    var pendingGames = await db.getPendingGames();

    if(pendingGames.length > 0) {
        console.log(`Found ${pendingGames.length} games`);

        for (const data of pendingGames) {
            console.log(`URL to handle: ${data.url}`);

            var existingGameName = await db.tryGetGameName(data.gameId);

            console.log(`Existing Game Name: ${existingGameName}`);

            if(!existingGameName) {
                let gameName = await extractGameName(data.url);
                if(await isRiftGame(data.gameId))
                {
                    gameName = gameName + ' (Rift)';
                }

                console.log(`Web scrapped Game Name: ${gameName}`)
                await db.createGame(data.gameId, gameName, data.createdOn);
            }

            await db.assignUser(data.gameId, data.userName);
            await db.deletePendingGame(data.url);
        }
    } else {
        console.log("No Pending Games. Skipping");
    }
}  

async function extractGameName(url) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const title = $('title').text();
    return title.split('off')[1].split('|')[0].trim();
}

async function isRiftGame(gameId) {
    const response = await axios.get(`https://www.meta.com/es-es/experiences/${gameId}/`);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('title').text();

    if(title.includes('Rift')) {
        return true;
    }
    return false;
}

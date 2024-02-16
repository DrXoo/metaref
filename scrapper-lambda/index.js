const axios = require('axios');
const cheerio = require('cheerio');

exports.handler = async (event, context, callback) => {
    var urls = await event.Records.map((record) => record.body.gameUrl);
    
    for (const url of urls) {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const title = $('title').text();
        const gameName = title.split('off')[1].split('|')[0].trim();
        console.log(gameName);
    }
}
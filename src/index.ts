import { Handler } from 'aws-lambda';
import TelegramBot = require('node-telegram-bot-api');

const token = '1713277140:AAGPGf0aDLaZcXWaXPc_WeRFZKMsSS17Fjo';

export const handler: Handler = async (event, context) => {
    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, {polling: true});

    // Matches "/echo [whatever]"
    bot.onText(/\/echo (.+)/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message
    
        const chatId = msg.chat.id;
        const resp = match![1]; // the captured "whatever"
    
        // send back the matched "whatever" to the chat
        bot.sendMessage(chatId, resp);
    });

    // Listen for any kind of message. There are different kinds of
    // messages.
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
    
        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your message');
    });

    return context.logStreamName;
};


// Test
handler({}, { 
    functionName:"pepe",
    functionVersion:"pepe",
    invokedFunctionArn:"pepe",
    memoryLimitInMB:"1024",
    logGroupName:"pepe",
    logStreamName:"pepe",
    awsRequestId:"pepe",
    callbackWaitsForEmptyEventLoop:false,
    getRemainingTimeInMillis: () => 0,
    done: () => null,
    fail:  () => null,
    succeed:  () => null

}, () => console.log("pepe"));
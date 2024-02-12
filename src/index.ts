import 'dotenv/config'
import { Handler } from 'aws-lambda';
import { Telegraf } from 'telegraf';
import { StartMenu } from './startMenu';
import { RequestReferralMenu } from './requestReferralMenu';

export const handler: Handler = async (event, context) => {
    const bot = new Telegraf(process.env.TOKEN!)

    new StartMenu(bot);
    new RequestReferralMenu(bot);

    bot.launch();

    return context.logStreamName;
};

// interaccion entre usuario y bot
// nodo raiz, siguiente nodo, nodo anterior

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
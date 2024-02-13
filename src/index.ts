import 'dotenv/config'
import { Handler } from 'aws-lambda';
import { Telegraf } from 'telegraf';
import { StartMenu } from './startMenu';
import { RequestReferralMenu } from './requestReferralMenu';
import { onMessage } from './onMessageEventEmitter';

export const handler: Handler = async (event, context) => {
    const bot = new Telegraf(process.env.TOKEN!)

    new StartMenu(bot);
    new RequestReferralMenu(bot);

    bot.on("text", async (ctx) => {        
        await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id)
        onMessage.publish(ctx, ctx.message.text);
    });

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
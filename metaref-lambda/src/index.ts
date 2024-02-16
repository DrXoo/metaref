import 'dotenv/config'
import { Handler } from 'aws-lambda';
import { Telegraf } from 'telegraf';
import { StartMenu } from './menus/startMenu';
import { RequestReferralMenu } from './menus/requestReferralMenu';
import { GiveReferralMenu } from './menus/giveReferralMenu';

export const handler: Handler = async (event, context) => {
    const bot = new Telegraf(process.env.TOKEN!)

    new StartMenu(bot);
    const giveReferralMenu = new GiveReferralMenu(bot);
    const requestReferralMenu = new RequestReferralMenu(bot);

    bot.on("text", async (ctx) => {       
        await ctx.deleteMessage(ctx.message.message_id);
        await requestReferralMenu.onMessage(ctx, ctx.message.text);
        await giveReferralMenu.onMessage(ctx, ctx.message.text);
    });

    bot.launch();

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
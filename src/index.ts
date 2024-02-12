import 'dotenv/config'
import { Handler } from 'aws-lambda';
import { ExampleDialog } from './models/dialogs/exampleDialog';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters'

export const handler: Handler = async (event, context) => {
    const bot = new Telegraf(process.env.TOKEN!)

    const exampleDialog = new ExampleDialog();

    bot.command(exampleDialog.commandTrigger, async (ctx) => {
        await ctx.reply(exampleDialog.currentInteraction().message);
    });

    bot.on(message('text'), async (ctx) => {
        await exampleDialog.processMessage(ctx, ctx.message.text);
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
import 'dotenv/config'
import http from "serverless-http";
import { Telegraf } from 'telegraf';
import { StartMenu } from './menus/startMenu';
import { RequestReferralMenu } from './menus/requestReferralMenu';
import { GiveReferralMenu } from './menus/giveReferralMenu';

const bot = new Telegraf(process.env.TOKEN!, { telegram: { webhookReply: true }})

new StartMenu(bot);
const giveReferralMenu = new GiveReferralMenu(bot);
const requestReferralMenu = new RequestReferralMenu(bot);

bot.on("text", async (ctx) => {          
    await requestReferralMenu.onMessage(ctx, ctx.message.text);
    await giveReferralMenu.onMessage(ctx, ctx.message.text);
    await ctx.deleteMessage(ctx.message.message_id);
});

export const metarefBot = http(bot.webhookCallback("/webhook"));

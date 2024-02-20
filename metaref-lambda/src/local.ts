import 'dotenv/config'
import { Telegraf } from 'telegraf';
import { StartMenu } from './menus/startMenu';
import { RequestReferralMenu } from './menus/requestReferralMenu';
import { GiveReferralMenu } from './menus/giveReferralMenu';

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

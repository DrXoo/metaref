import 'dotenv/config'
import http from "serverless-http";
import { Telegraf } from 'telegraf';
import { StartMenu } from './menus/startMenu';
import { RequestReferralMenu } from './menus/requestReferralMenu';
import { GiveReferralMenu } from './menus/giveReferralMenu';
import { InfoMenu } from './menus/infoMenu';
import { es_translations } from './i18n/es';
import { en_translations } from './i18n/en';
import i18next from 'i18next';
import { InstructionsMenu } from './menus/instructionsMenu';

const bot = new Telegraf(process.env.TOKEN!, { telegram: { webhookReply: true }});

i18next.init({
    lng: 'es', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: {
            translation: en_translations
        },
        es: {
            translation: es_translations
        }
    }
});

new StartMenu(bot, i18next);
const giveReferralMenu = new GiveReferralMenu(bot, i18next);
const requestReferralMenu = new RequestReferralMenu(bot, i18next);
new InfoMenu(bot, i18next);
new InstructionsMenu(bot, i18next);

bot.on("text", async (ctx) => {          
    await requestReferralMenu.onMessage(ctx, ctx.message.text);
    await giveReferralMenu.onMessage(ctx, ctx.message.text);
    await ctx.deleteMessage(ctx.message.message_id);
});

export const metarefBot = http(bot.webhookCallback("/webhook"));

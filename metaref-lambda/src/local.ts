import 'dotenv/config'
import { Telegraf } from 'telegraf';
import { StartMenu } from './menus/startMenu';
import { RequestReferralMenu } from './menus/requestReferralMenu';
import { GiveReferralMenu } from './menus/giveReferralMenu';
import i18next from 'i18next';
import { readFileSync } from 'fs'
import { InfoMenu } from './menus/infoMenu';

const bot = new Telegraf(process.env.TOKEN!, { telegram: { webhookReply: true }});

const enTranslations = JSON.parse(readFileSync('./i18n/en.json', { encoding: 'utf8'}));
const esTranslations = JSON.parse(readFileSync('./i18n/es.json', { encoding: 'utf8'}));
i18next.init({
    lng: 'es', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
        en: {
            translation: enTranslations
        },
        es: {
            translation: esTranslations
        }
    }
});

new StartMenu(bot, i18next);
const giveReferralMenu = new GiveReferralMenu(bot, i18next);
const requestReferralMenu = new RequestReferralMenu(bot, i18next);
new InfoMenu(bot, i18next);

bot.on("text", async (ctx) => {          
    await requestReferralMenu.onMessage(ctx, ctx.message.text);
    await giveReferralMenu.onMessage(ctx, ctx.message.text);
    await ctx.deleteMessage(ctx.message.message_id);
});

bot.launch();

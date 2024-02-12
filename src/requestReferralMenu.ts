import { Context, Markup, Telegraf } from "telegraf";
import { ParseMode } from "telegraf/typings/core/types/typegram";

export class RequestReferralMenu {

    constructor(bot: Telegraf) {
        bot.action('device', async (ctx) => {
            await ctx.editMessageText('Go to Give referral device', {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral')
                ]),
            });
        });

        bot.action('game', async (ctx) => {
            await ctx.editMessageText('Introduce el nombre del juego', {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral')
                ]),
            });
        });

        bot.action('request_referral', async (ctx) => {
            const menuUI = this.menuUI();
            ctx.editMessageText(menuUI.text,menuUI.properties);
        });
    }

    private menuUI : () => { text: string, properties: { parse_mode?: ParseMode | undefined }} = () => {
        return { text:`
            📥 Ha seleccionado pedir referidos

            Este apartado está destinado a que pueda solicitar referidos tanto para visor, 
            como para cualquier aplicación que desee

            A continuación, seleccione si desea recibir referido de visor o de alguna aplicación
        `, properties: {
            parse_mode: 'MarkdownV2',
            ...Markup.inlineKeyboard([
                Markup.button.callback('Visor', 'device'),
                Markup.button.callback('Juego', 'game'),
                Markup.button.callback('Volver', 'return_start')
            ]),
        }}
    }
}
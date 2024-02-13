import { Context, Markup, Telegraf } from "telegraf";
import { ParseMode } from "telegraf/typings/core/types/typegram";
import { onMessage } from './onMessageEventEmitter';

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
            onMessage.subscribe(this.manageOnMessage)
        });

        bot.action('request_referral', async (ctx) => {
            const menuUI = this.menuUI();
            ctx.editMessageText(menuUI.text,menuUI.properties);
        });
    }

    private async manageOnMessage(context: Context, text: string)
    {
        onMessage.unSubscribe(this.manageOnMessage);

        //await context.telegram.deleteMessage(context.chat!.id, context.message?.message_id!);
        await context.telegram.editMessageText(context.chat!.id, context.message?.message_id! - 1, undefined, "Searching....");
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
import { Context, Markup, Telegraf } from "telegraf";
import { ParseMode } from "telegraf/typings/core/types/typegram";
import { Menu } from "./menu";

export class RequestReferralMenu extends Menu {
        constructor(bot: Telegraf) {
        super();
        bot.action('request_device_referral', async (ctx) => {
            await ctx.editMessageText('Go to Give referral device', {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral')
                ]),
            });
        });

        bot.action('request_game_referral', async (ctx) => {
            await ctx.editMessageText('Introduce el nombre del juego', {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral')
                ]),
            });
            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!)
        });

        bot.action('request_referral', async (ctx) => {
            const menuUI = this.menuUI();
            await ctx.editMessageText(menuUI.text,menuUI.properties);
        });
    }

    public async manageOnMessage(context: Context, messageId: number, text: string)
    {
        await context.telegram.editMessageText(
            context.chat!.id, 
            messageId, 
            undefined, 
            `The game that you wrote is: ${text}`, 
            {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral'),
                  Markup.button.callback('Volver al inicio', 'return_start')
                ]),
            
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
            ...Markup.inlineKeyboard([[
                Markup.button.callback('Visor', 'request_device_referral'),
                Markup.button.callback('Juego', 'request_game_referral'),
            ], [ Markup.button.callback('Volver', 'return_start') ]]),
        }}
    }
}
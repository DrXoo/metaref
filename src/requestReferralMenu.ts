import { Context, Markup, Telegraf } from "telegraf";
import { ParseMode } from "telegraf/typings/core/types/typegram";

export class RequestReferralMenu {
    
    // Block any onMessage process until we are actually listening
    private listenToOnMessage : boolean = false;

    // I am afraid that multiple people can request a game name at the same time. 
    // this means that the messageId for the editMessage on the onMessage event
    // will be different for those two chats
    // using this map we can save each chatId to its bot messageId
    private chatIdToBotMessageId : Map<number, number> = new Map<number, number>();

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
            this.listenToOnMessage = true;
            this.chatIdToBotMessageId.set(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!)
        });

        bot.action('request_referral', async (ctx) => {
            const menuUI = this.menuUI();
            await ctx.editMessageText(menuUI.text,menuUI.properties);
        });
    }

    public async manageOnMessage(context: Context, text: string)
    {
        if(this.listenToOnMessage) {
            this.listenToOnMessage = false;
            const message_id = this.chatIdToBotMessageId.get(context.chat?.id!);
            await context.telegram.editMessageText(
                context.chat!.id, 
                message_id, 
                undefined, 
                `The game that you wrote is: ${text}`, 
                {
                    ...Markup.inlineKeyboard([
                      Markup.button.callback('Volver', 'request_referral'),
                      Markup.button.callback('Volver al inicio', 'return_start')
                    ]),
                
                });
        }
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
import { Context, Markup, Telegraf } from "telegraf";
import { ParseMode } from "telegraf/typings/core/types/typegram";
import { Menu } from "./abstracts/menu";

export class StartMenu extends Menu {
    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.command("start", async (ctx) => {
            const startMessage = this.menuUI(ctx);
            await ctx.reply(startMessage.text, startMessage.properties);
        });

        bot.action('return_start', async (ctx) => {
            const startMessage = this.menuUI(ctx);
            await ctx.editMessageText(startMessage.text, startMessage.properties);
        })
    }

    private menuUI : (ctx: Context) => { text: string, properties: { parse_mode?: ParseMode | undefined }} = (ctx: Context) => {
        return { text: this.translate(ctx,'start.text', { userName: ctx.from?.first_name}), properties: {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([[
                Markup.button.callback(this.translate(ctx,'start.button.give'), 'give_referral'),
                Markup.button.callback(this.translate(ctx,'start.button.request'), 'request_referral'),
            ], [ Markup.button.callback(this.translate(ctx,'start.button.info'), 'information') ],
            [ Markup.button.callback(this.translate(ctx,'start.button.instructions'), 'instructions') ], 
            [ Markup.button.url(this.translate(ctx, 'start.button.support'), 'https://t.me/metaref_support')]]),
        }}
    }
}
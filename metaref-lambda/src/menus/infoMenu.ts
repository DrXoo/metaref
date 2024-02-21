import { Markup, Telegraf } from "telegraf";
import { Menu } from "./abstracts/menu";

export class InfoMenu extends Menu {
    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.action('information', async (ctx) => {
            await ctx.editMessageText(this.translate(ctx, 'information'), {
                ...Markup.inlineKeyboard([
                  Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')
                ]),
            }); 
        })
    }
}
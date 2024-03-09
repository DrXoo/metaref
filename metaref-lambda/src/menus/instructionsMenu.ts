import { Markup, Telegraf } from "telegraf";
import { Menu } from "./abstracts/menu";

export class InstructionsMenu extends Menu {
    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.action('instructions', async (ctx) => {
            await ctx.editMessageText(this.translate(ctx, 'instructions.text'), {
                ...Markup.inlineKeyboard([
                    [Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')]
                ]),
            }); 
        })
    }
}
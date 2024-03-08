import { Markup, Telegraf } from "telegraf";
import { Menu } from "./abstracts/menu";

export class InfoMenu extends Menu {
    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.action('information', async (ctx) => {
            await ctx.editMessageText(this.translate(ctx, 'info.text'), {
                ...Markup.inlineKeyboard([
                    [Markup.button.url(this.translate(ctx, 'info.button.availableCountries'), 'https://www.meta.com/help/orders-and-returns/articles/quest-supported-countries/')],
                    [Markup.button.url(this.translate(ctx, 'info.button.deviceRecomendations'), 'https://www.meta.com/legal/quest/referral-program/?utm_source=www.meta.com&utm_medium=dollyredirect')],
                    [Markup.button.url(this.translate(ctx, 'info.button.appRecomendations'), 'https://www.meta.com/legal/quest/app-referrals/')],
                    [Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')]
                ]),
            }); 
        })
    }
}
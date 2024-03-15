import { Markup, Telegraf } from "telegraf";
import { Menu } from "./abstracts/menu";
import { getUserByExternalUserId } from "../aws/db/user-repository";
import { getAllGamesByUser } from "../aws/db/game-repository";

export class ProfileMenu extends Menu {
    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.action('profile', async (ctx) => {

            const userId = ctx.from?.id;

            if(!userId) {
                console.log('telegram user has not public profile')
                await ctx.editMessageText(this.translate(ctx, 'profile.text'), {
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')]
                    ]),
                }); 
            }
            else {
                var existingUser = await getUserByExternalUserId(userId);

                var games = await getAllGamesByUser(userId);
                var gameNames = games
                    .map(x => x.rawGameName)
                    .sort()
                    .map(x => `- ${x}\n`)
                    .join('');
    
                await ctx.editMessageText(this.translate(ctx, 'profile.text', 
                    { userName: existingUser?.userName, games: gameNames}), {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                        [Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')]
                    ]),
                }); 
            }


        })
    }
}
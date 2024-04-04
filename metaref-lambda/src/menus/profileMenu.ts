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

                // TODO: IMPROVE THIS
                if(gameNames.length > 4000) {
                    const lastGameIndex = gameNames.indexOf('-', 3500);
                    const firstPart = gameNames.substring(0, lastGameIndex - 1);
                    const secondPart = gameNames.substring(lastGameIndex, gameNames.length);

                    await ctx.editMessageText(this.translate(ctx, 'profile.text', 
                        { userName: existingUser?.userName, games: firstPart}), {
                        parse_mode: 'HTML'
                    }); 

                    await ctx.sendMessage(secondPart, {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard([
                            [Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')]
                        ]),
                    }); 
                    
                } else {
                    await ctx.editMessageText(this.translate(ctx, 'profile.text', 
                        { userName: existingUser?.userName, games: gameNames}), {
                        parse_mode: 'HTML',
                        ...Markup.inlineKeyboard([
                            [Markup.button.callback(this.translate(ctx, 'button.return'), 'return_start')]
                        ]),
                    }); 
                }
            }
        })
    }
}
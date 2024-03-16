import { Context, Markup, Telegraf } from "telegraf";
import { getUsersForGame, searchGame } from "../aws/db/game-repository";
import { getAllUsers } from "../aws/db/user-repository";
import { buildAppUrl, buildDeviceUrl, normalizeGameNameText } from "../utils/referralUtils";
import { InteractionMenu } from "./abstracts/interactionMenu";

export class RequestReferralMenu extends InteractionMenu {

    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.action('request_device_referral', async (ctx) => {
            var users = await getAllUsers();
       
            if(users.length == 0) {
                await ctx.editMessageText(this.translate(ctx, 'request.device.noUsers'), {
                    ...Markup.inlineKeyboard([
                      Markup.button.callback(this.translate(ctx, 'button.return'), 'request_referral'),
                      Markup.button.callback(this.translate(ctx, 'button.returnStart'), 'return_start')
                    ]),
                });
            }
            else {
                // Select a random user
                const randomUser = users[Math.floor(Math.random() * users.length)];
                await ctx.editMessageText(this.translate(ctx, 'request.device.deviceReferral', 
                { 
                    url: buildDeviceUrl(randomUser!.userName), interpolation: {escapeValue: false},
                    numUsers: users.length
                }), {
                    parse_mode: 'HTML',
                    ...Markup.inlineKeyboard([
                      Markup.button.callback(this.translate(ctx, 'button.return'), 'request_referral'),
                      Markup.button.callback(this.translate(ctx, 'button.returnStart'), 'return_start')
                    ]),
                });
            }
        });

        bot.action('request_game_referral', async (ctx) => {
            await ctx.editMessageText(this.translate(ctx, 'request.games.requestGameReferral'), {
                ...Markup.inlineKeyboard([
                  Markup.button.callback(this.translate(ctx, 'button.return'), 'request_referral')
                ]),
            });
            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!)
        });

        bot.action(/selected_referral-\w*,\w*$/, async (ctx) => {
            const data = ctx.match[0].split('-')[1].split(',');
            const usersId = await getUsersForGame(data[1]);
            const randomUserId = usersId[Math.floor(Math.random() * usersId.length)].userName
            const appReferral = buildAppUrl(randomUserId, data[1])
            await ctx.telegram.editMessageText(ctx.chat!.id, Number.parseInt(data[0]), undefined, 
                this.translate(ctx, 'request.games.gameReferral', 
                { 
                    url: appReferral , interpolation: {escapeValue: false},
                    numUsers: usersId.length
                }), {
                    parse_mode: 'HTML',
                ...Markup.inlineKeyboard([
                  Markup.button.callback(this.translate(ctx, 'button.return'), 'request_referral'),
                  Markup.button.callback(this.translate(ctx, 'button.returnStart'), 'return_start')
                ]),
            });
        });

        bot.action('request_referral', async (ctx) => {
            this.clearListenMessage(ctx.chat?.id!);
            
            await ctx.editMessageText(this.translate(ctx, 'request.text'), {
            ...Markup.inlineKeyboard([[
                Markup.button.callback(this.translate(ctx, 'button.device'), 'request_device_referral'),
                Markup.button.callback(this.translate(ctx, 'button.game'), 'request_game_referral'),
            ], [ Markup.button.callback(this.translate(ctx, 'button.returnStart'), 'return_start') ]]),
        });
        });
    }

    public async manageOnMessage(context: Context, messageId: number, text: string)
    {
        const games = await searchGame(normalizeGameNameText(text));

        if(games.length > 0) {
            let buttons : any = [];
                games.forEach(game => {
                buttons.push([Markup.button.callback(game.gameName, `selected_referral-${messageId},${game.gameId}`)])
            });

            await context.telegram.editMessageText(
               context.chat!.id, 
               messageId, 
               undefined, 
               this.translate(context, 'request.games.foundRequestGames'), 
               { ...Markup.inlineKeyboard([...buttons, 
                   [Markup.button.callback(this.translate(context, 'button.return'), 'request_referral')] ]) });
        } else {
            await context.telegram.editMessageText(
                context.chat!.id, 
                messageId, 
                undefined, 
                this.translate(context, 'request.games.notFoundRequestGames'), 
                { ...Markup.inlineKeyboard([ Markup.button.callback(this.translate(context, 'button.return'), 'request_referral') ]) });
        }
    }
}
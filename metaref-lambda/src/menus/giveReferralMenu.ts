import { Context, Markup, Telegraf } from "telegraf";
import { ReferralType } from "../models/referralType";
import { buildAppUrl, parseDeviceLink, parseGameLink } from "../utils/referralUtils";
import { createUser } from "../aws/db/user-repository";
import { assignUsers, createPendingGame as createPendingGames, getGamesByIdsBatch } from "../aws/db/game-repository";
import { InteractionMenu } from "./abstracts/interactionMenu";

export class GiveReferralMenu extends InteractionMenu {
    
    private urlRegex = /(https?:\/\/[^\s]+)/g;

    constructor(bot: Telegraf, i18n: any) {
        super(i18n);

        bot.action('give_device_referral', async (ctx) => {
            await ctx.editMessageText(this.translate(ctx, 'give.device.text'), 
                { ...Markup.inlineKeyboard([Markup.button.callback(this.translate(ctx, 'button.return'), 'give_referral'),])});

            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!, { referralType: ReferralType.DEVICE.toString() })
        });

        bot.action('give_app_referral', async (ctx) => {
            await ctx.editMessageText(this.translate(ctx, 'give.games.text'), 
                { ...Markup.inlineKeyboard([Markup.button.callback(this.translate(ctx, 'button.return'), 'give_referral'),])});

            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!, { referralType: ReferralType.APP.toString() })
        });

        bot.action('give_referral', async (ctx) => {
            this.clearListenMessage(ctx.chat?.id!);
            
            await ctx.editMessageText(this.translate(ctx, 'give.text'), {
                ...Markup.inlineKeyboard([[
                    Markup.button.callback(this.translate(ctx, 'button.device'), 'give_device_referral'),
                    Markup.button.callback(this.translate(ctx, 'button.games'), 'give_app_referral'),
                ],[
                    Markup.button.callback(this.translate(ctx, 'button.returnStart'), 'return_start')
                  ]]),
            });
        });
    }

    public async manageOnMessage(context: Context, messageId: number, text: string, data?: Record<string, string>)
    {
        if(data?.referralType == ReferralType.DEVICE.toString()) {
            const userName = parseDeviceLink(text.trim());
            if(userName && userName.length > 0 && !userName.includes(" ")) {
                var result = await createUser(userName, context.from?.id!);

                if(result) {
                    await this.editMessageAtManageMessage(context, messageId, this.translate(context, 'give.device.added', { userName }));
                }else {
                    await this.editMessageAtManageMessage(context, messageId, this.translate(context, 'give.device.alreadyAdded'));
                }
            }
            else {
                await this.editMessageAtManageMessage(context, messageId, this.translate(context, 'give.device.wrongFormat'));
            }
        } else if (data?.referralType == ReferralType.APP.toString()) {
            const urls = text.match(this.urlRegex);

            if (urls && urls.length > 0) {
                if(urls.length > 20) {
                    await this.editMessageAtManageMessage(context, messageId, this.translate(context, 'give.games.tooManyUrls'));
                } 
                else {
                    const userId = context.from?.id!; 
                    const gameReferrals = urls.map(url => parseGameLink(url));

                    const existingGames = await getGamesByIdsBatch(gameReferrals.map(x => x.gameId!)); 
                    const existingGameIds = existingGames.map(x => x.gameId);
                    await assignUsers(gameReferrals.filter(x => existingGameIds.includes(x.gameId)), userId);
    
                    const nonExistingGames = gameReferrals.filter(x => !existingGameIds.includes(x.gameId!));
                    const urlsForNonExistingGames = nonExistingGames.map(x => {
                        return {
                            gameId: x.gameId,
                            userName: x.userName,
                            url: buildAppUrl(x.userName!, x.gameId!)
                        }
                    });

                    if(urlsForNonExistingGames.length > 0) {
                        await createPendingGames(urlsForNonExistingGames, userId);
                    }
                
                    await this.editMessageAtManageMessage(context, messageId, this.translate(context, 'give.games.added', { games: gameReferrals.length}));
                }
            } else {
                await this.editMessageAtManageMessage(context, messageId, this.translate(context, 'give.games.noFoundGames'));
            }
        }
    }

    private async editMessageAtManageMessage(context: Context, messageId: number, editedText: string) {
        await context.telegram.editMessageText(
            context.chat!.id, 
            messageId, 
            undefined, 
            editedText, 
            {
                ...Markup.inlineKeyboard([
                  Markup.button.callback(this.translate(context, 'button.return'), 'give_referral'),
                  Markup.button.callback(this.translate(context, 'button.returnStart'), 'return_start')
                ]),
            });
    }
}
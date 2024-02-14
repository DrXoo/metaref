import { Context, Markup, Telegraf } from "telegraf";
import { Menu } from "./menu";
import { ReferralType } from "../models/referralType";
import { parseAppLink, parseDeviceLink } from "../utls/referralUtils";
import { createUser } from "./../db/dbClient"

export class GiveReferralMenu extends Menu {
    
    private referralType: ReferralType | undefined;
    private urlRegex = /(https?:\/\/[^\s]+)/g;

    constructor(bot: Telegraf) {
        super();

        bot.action('give_device_referral', async (ctx) => {
            await ctx.editMessageText('A continuación escribe tu nombre de usuario de Meta');

            this.referralType = ReferralType.DEVICE;
            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!)
        });

        bot.action('give_app_referral', async (ctx) => {
            await ctx.editMessageText('A continuación pega los enlaces de referidos de aplicaciones');

            this.referralType = ReferralType.APP;
            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!)
        });

        bot.action('give_referral', async (ctx) => {
            await ctx.editMessageText(`
            📤 Ha seleccionado dar referidos

            Este apartado está destinado a que pueda registrar sus enlaces para poder 
            darlos a futuras personas que pidan referidos de las apps que nos proporcione

            A continuación, seleccione si desea dar referido de visor o de applicaciones`, {
                ...Markup.inlineKeyboard([[
                    Markup.button.callback('Visor', 'give_device_referral'),
                    Markup.button.callback('Applicaciones', 'give_app_referral'),
                ],[
                    Markup.button.callback('Volver', 'return_start')
                  ]]),
            });
        });
    }

    public async manageOnMessage(context: Context, messageId: number, text: string)
    {
        if(this.referralType == ReferralType.DEVICE) {
            const userName = text.trim();
            if(userName.length > 0 && !userName.includes(" ")) {
                var result = await createUser(userName);
                if(result) {
                    await this.editMessageAtManageMessage(context, messageId, `Referido de visor del usuario ${userName} ha sido añadido`);
                }else {
                    await this.editMessageAtManageMessage(context, messageId, `Usuario ya agregado`);
                }
            }
            else {
                await this.editMessageAtManageMessage(context, messageId, `Formato incorrecto`);
            }
        } else if (this.referralType == ReferralType.APP) {
            const urls = text.match(this.urlRegex);

            if (urls && urls.length > 0) {
                const appReferrals = urls.map(url => parseAppLink(url));
                await this.editMessageAtManageMessage(context, messageId, `App Referrals detected: ${appReferrals.length}`);
            } else {
                await this.editMessageAtManageMessage(context, messageId, `No app referrals detected`);
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
                  Markup.button.callback('Volver', 'give_referral'),
                  Markup.button.callback('Volver al inicio', 'return_start')
                ]),
            });
    }
}
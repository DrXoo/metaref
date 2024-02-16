import { Context, Markup, Telegraf } from "telegraf";
import { Menu } from "./menu";
import { getRandomUser, searchGame } from "../db/dbClient";

export class RequestReferralMenu extends Menu {
    
    private deviceReferralTemplate: string = "https://www.meta.com/referrals/link/";
    private appReferralTemplate: string = "https://www.oculus.com/appreferrals/USER/APP"

    constructor(bot: Telegraf) {
        super();
        bot.action('request_device_referral', async (ctx) => {
            var randomUser = await getRandomUser();
            await ctx.editMessageText(
                `Aquí tiene su referido
            
                ${this.deviceReferralTemplate}${randomUser?.userId}
            `, {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral')
                ]),
            });
        });

        bot.action('request_game_referral', async (ctx) => {
            await ctx.editMessageText('Introduce el nombre del juego', {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral')
                ]),
            });
            this.setToListenMessage(ctx.chat?.id!, ctx.callbackQuery?.message?.message_id!)
        });

        bot.action(/selected_referral-\w*,\w*,\w*$/, async (ctx) => {
            const data = ctx.match[0].split('-')[1].split(',');
            const appReferral = this.appReferralTemplate.replace('USER',data[2]).replace('APP',data[0])
            await ctx.editMessageText(
`
Aquí está el referido para la aplicación que has seleccionado

${appReferral}
`, {

                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral'),
                  Markup.button.callback('Volver al inicio', 'return_start')
                ]),
            });
        });

        bot.action('request_referral', async (ctx) => {
            await ctx.editMessageText(`
            📥 Ha seleccionado pedir referidos

            Este apartado está destinado a que pueda solicitar referidos tanto para visor, 
            como para cualquier aplicación que desee

            A continuación, seleccione si desea recibir referido de visor o de alguna aplicación
        `,{
            parse_mode: 'MarkdownV2',
            ...Markup.inlineKeyboard([[
                Markup.button.callback('Visor', 'request_device_referral'),
                Markup.button.callback('Applicación', 'request_game_referral'),
            ], [ Markup.button.callback('Volver', 'return_start') ]]),
        });
        });
    }

    public async manageOnMessage(context: Context, messageId: number, text: string)
    {
        const games = await searchGame(text.toLowerCase().replace(/\s/g, ''));
        const mapGames : Map<string, { gameName: string, userIds: string[]}> = new Map<string, { gameName: string, userIds: []}>();
        games.forEach(game => {
            if(mapGames.has(game.gameId)) {
                mapGames.get(game.gameId)!.userIds.push(game.userId);
            }else {
                mapGames.set(game.gameId, { gameName: game.gameName, userIds: [game.userId]});
            }
        });

        let buttons : any = [];
         mapGames.forEach((game, gameId) => {
            console.log(`selected_referral-${gameId},${messageId},${game.userIds[Math.floor(Math.random() * game.userIds.length)]}`);
            buttons.push(Markup.button.callback(game.gameName, `selected_referral-${gameId},${messageId},${game.userIds[Math.floor(Math.random() * game.userIds.length)]}`))
        })

        await context.telegram.editMessageText(
            context.chat!.id, 
            messageId, 
            undefined, 
            `I have found some games with that name. Please select the one that you want`, 
            { ...Markup.inlineKeyboard(buttons) });
    }
}
import { Context, Markup, Telegraf } from "telegraf";
import { Menu } from "./menu";
import { getUsersForGame, searchGame } from "../aws/db/game-repository";
import { getRandomUser } from "../aws/db/user-repository";
import { buildAppUrl, buildDeviceUrl, normalizeGameNameText } from "../utls/referralUtils";

export class RequestReferralMenu extends Menu {

    constructor(bot: Telegraf) {
        super();
        bot.action('request_device_referral', async (ctx) => {
            var randomUser = await getRandomUser();
            await ctx.editMessageText(
                `Aquí tiene su referido
                
                ${buildDeviceUrl(randomUser!.userName)}
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

        bot.action(/selected_referral-\w*,\w*$/, async (ctx) => {
            const data = ctx.match[0].split('-')[1].split(',');
            const usersId = await getUsersForGame(data[1]);
            const randomUserId = usersId[Math.floor(Math.random() * usersId.length)].userName
            const appReferral = buildAppUrl(randomUserId, data[1])
            await ctx.telegram.editMessageText(ctx.chat!.id, Number.parseInt(data[0]), undefined, 
`
Aquí está el referido para el juego que has seleccionado

${appReferral}
`, {

                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'request_referral'),
                  Markup.button.callback('Volver al inicio', 'return_start')
                ]),
            });
        });

        bot.action('request_referral', async (ctx) => {
            this.clearListenMessage(ctx.chat?.id!);
            
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
        const games = await searchGame(normalizeGameNameText(text));

        let buttons : any = [];
         games.forEach(game => {
            buttons.push(Markup.button.callback(game.gameName, `selected_referral-${messageId},${game.gameId}`))
        });

        await context.telegram.editMessageText(
            context.chat!.id, 
            messageId, 
            undefined, 
            `He encontrado algunos juegos con ese nombre, elije el tuyo`, 
            { ...Markup.inlineKeyboard(buttons) });
    }
}
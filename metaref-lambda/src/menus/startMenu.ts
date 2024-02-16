import { Markup, Telegraf } from "telegraf";
import { ParseMode } from "telegraf/typings/core/types/typegram";

export class StartMenu {

    constructor(bot: Telegraf) {
        bot.command("start", async (ctx) => {
            const startMessage = this.menuUI();
            await ctx.deleteMessage(ctx.message.message_id);
            await ctx.reply(startMessage.text, startMessage.properties);
        });

        bot.action('information', async (ctx) => {
            await ctx.editMessageText(`
            💎 El programa de referidos de Meta, es un programa de recomendaciones entre amigos 
            por recomendar la compra de sus visores o aplicaciones\\. Proporcionan respectivos 
            descuentos o saldo para la tienda de aplicaciones

            🔹 Por visor, actualmente, se otorga 30€ tanto a la persona referida como al referido

            🔸 Por aplicación, actualmente, se otorga 25% de descuento a la persona referida, y 5€ al referido

            ⚠️ Estas condiciones estan sujetas a cambios y solo vigentes en los países disponibles 
            donde Meta da servicio, para más información, pulsa en el botón de más información`, {
                ...Markup.inlineKeyboard([
                  Markup.button.callback('Volver', 'return_start')
                ]),
            }); 
        })

        bot.action('return_start', async (ctx) => {
            const startMessage = this.menuUI();
            await ctx.editMessageText(startMessage.text, startMessage.properties);
        })
    }

    private menuUI : () => { text: string, properties: { parse_mode?: ParseMode | undefined }} = () => {
        return { text:`
        👋🏻 Hola\\! 

        Bienvenido al bot de referidos de Meta, este bot es un bot de terceras personas que no tiene 
        ninguna afiliación con la empresa Meta, cuyo objetivo es dar y recibir afiliados de manera aleatoria y
        de la manera más justa para todos

        💎 Seleccione Información si desea leer más sobre el programa de referidos de Meta

        En caso de que este informado, seleccione la opción que mejor le corresponda
        `, properties: {
            parse_mode: 'MarkdownV2',
            ...Markup.inlineKeyboard([[
                Markup.button.callback('Dar', 'give_referral'),
                Markup.button.callback('Pedir', 'request_referral'),
            ], [ Markup.button.callback('Información', 'information') ]]),
        }}
    }
}
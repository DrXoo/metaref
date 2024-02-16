import { Context } from "telegraf";

interface ListenInteraction
{
    messageId: number,
    canListen: boolean
}

export abstract class Menu {

    // I am afraid that multiple people can request a game name at the same time. 
    // this means that the messageId for the editMessage on the onMessage event
    // will be different for those two chats
    // using this map we can save each chatId to its bot messageId
    private chatIdToBotMessageId : Map<number, ListenInteraction> = new Map<number, ListenInteraction>();

    public setToListenMessage(chatId: number, messageId: number) {
        this.chatIdToBotMessageId.set(chatId, { messageId, canListen: true })
    }

    protected abstract manageOnMessage(context: Context, messageId: number, text: string) : Promise<void>

    public async onMessage(context: Context, text: string) : Promise<void> 
    {
        const listenInteraction = this.chatIdToBotMessageId.get(context.chat?.id!);
        if(listenInteraction?.canListen)
        {
            this.chatIdToBotMessageId.delete(context.chat?.id!);
            await this.manageOnMessage(context, listenInteraction.messageId, text);
        }
    }
}
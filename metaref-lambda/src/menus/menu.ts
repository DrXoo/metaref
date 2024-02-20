import { Context } from "telegraf";

interface ListenInteraction
{
    messageId: number,
    data?: Record<string, string>
}

export abstract class Menu {

    // I am afraid that multiple people can request a game name at the same time. 
    // this means that the messageId for the editMessage on the onMessage event
    // will be different for those two chats
    // using this map we can save each chatId to its bot messageId
    private chatIdToBotMessageId : Map<number, ListenInteraction> = new Map<number, ListenInteraction>();

    public setToListenMessage(chatId: number, messageId: number, data?: Record<string, string>) {
        this.chatIdToBotMessageId.set(chatId, { messageId, data })
    }

    protected abstract manageOnMessage(context: Context, messageId: number, text: string, data?: Record<string, string>) : Promise<void>

    public async onMessage(context: Context, text: string) : Promise<void> 
    {
        const listenInteraction = this.chatIdToBotMessageId.get(context.chat?.id!);
        if(listenInteraction)
        {
            this.chatIdToBotMessageId.delete(context.chat?.id!);
            await this.manageOnMessage(context, listenInteraction.messageId, text, listenInteraction.data);
        }
    }
}
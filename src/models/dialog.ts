import { Node } from "./node";
import Context, { NarrowedContext } from "telegraf/typings/context";

/**
 * A Dialog consists in a Node tree interactions between user and bot.
 * This class is an abstract class and custom dialogs shall be created using this class
 * 
 * Each Dialog must have a commandTrigger which means the specific word to start the interactions
 */
export abstract class Dialog {
    
    protected interactions : Node[] = [];
    
    private currentInteractionIndex : number = 0;
    
    public commandTrigger: string;

    public currentInteraction = (): Node => {
        return this.interactions[this.currentInteractionIndex];
    };

    public checkInteraction = (text: string): void => {
        if(this.currentInteraction().interact(text)) {
            this.currentInteractionIndex++;
        }
    }

    public processMessage = async (context: Context, text : string) =>
    {
        this.checkInteraction(text)
        
        context.reply(this.currentInteraction().message);
    } 

    constructor(commandTrigger : string) {
        this.commandTrigger = commandTrigger;
    }
}
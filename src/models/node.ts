/**
 * Defines the interaction between the user and the bot
 * Each Node has a message and can trigger the next node given the check
 */
export interface Node 
{
    message: string;
    interact : (userMessage: string) => boolean;
}
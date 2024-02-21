import { Context } from "telegraf";

export abstract class Menu {

    private i18n: any

    constructor(i18n: any) {
        this.i18n = i18n;
    }

    public translate(ctx: Context, key: string, data?: {}) : string {
        const languageCode = ctx.from?.language_code;
        
        if(this.i18n.language !== languageCode) {
            this.i18n.changeLanguage(languageCode ? languageCode : 'en');
        }
        
        if(data) {
            return this.i18n.t(key, data);
        }
        else {
            return this.i18n.t(key);
        }
    }
}
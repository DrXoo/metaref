import { EventEmitter } from 'events';
import Context from 'telegraf/typings/context';

class OnMessageEventEmitter extends EventEmitter {
    public subscribe(textHandler: (context: Context, text: string) => void) {
        this.on('textReceived', textHandler);
    } 

    public unSubscribe(textHandler: (context: Context, text: string) => void) {
        this.off('textReceived', textHandler);
    } 

    public publish(context: Context, text: string) {
        this.emit('textReceived', context, text);
    }
}


const onMessage = new OnMessageEventEmitter();

export { onMessage };
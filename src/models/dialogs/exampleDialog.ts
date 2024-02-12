import { Dialog } from "../dialog";

export class ExampleDialog extends Dialog {
    constructor() {
        super("example");
        
        this.interactions.push({
            message: "Node1",
            interact: (userMessage: string) => true,
        });

        this.interactions.push({
            message: "Node2",
            interact: (userMessage: string) => true,
        });

        this.interactions.push({
            message: "Node3",
            interact: (userMessage: string) => true,
        });
    }
}
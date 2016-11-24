import { Action } from '../enums/action';

export class ActionLink {
    title: string;
    action: Action;
    icon: string;
    isOpen: boolean;
    
    constructor(title: string, action: Action, icon: string) {
        this.title = title;
        this.action = action;
        this.icon = icon;
    }
}
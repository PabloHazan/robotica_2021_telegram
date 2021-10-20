import { Markup, Scenes } from "telegraf";

export interface GPSLocation {
    latitude: number;
    longitude: number;
  }

export interface MessageAttachment {
    options?: Array<string>;
    useLocation?: boolean;
}

export const sendMessage = (context: Scenes.WizardContext<Scenes.WizardSessionData>, message: string | number, attachments?: MessageAttachment): void => {
    let options;
    let optionsButtons: Array<any> = [];

    if(attachments?.useLocation) optionsButtons.push(Markup.button.locationRequest('Mi ubicación (debe prender el GPS)'));
    if (attachments?.options) optionsButtons = optionsButtons.concat(attachments.options.map(option => Markup.button.text(option)));

    if (optionsButtons.length > 0) options = Markup.keyboard(optionsButtons).oneTime().resize().selective();
    
    context.reply(String(message), options);
}

export const getTextMessage = (context: Scenes.WizardContext<Scenes.WizardSessionData>): string => (context.message as any).text;

export const getLocationMessage = (context: Scenes.WizardContext<Scenes.WizardSessionData>): GPSLocation => (context.message as any).location;

export const isLocationMessage = (context: Scenes.WizardContext<Scenes.WizardSessionData>): boolean => !!((context.message as any).location);

export const readNumber = (context: Scenes.WizardContext<Scenes.WizardSessionData>) => {
    const text: string = getTextMessage(context);
    const value: number =  parseFloat(text);
    if (isNaN(value)) throw new Error('Invalid number');
    return value;
}

export const setSessionState: <StateType>(context: Scenes.WizardContext<Scenes.WizardSessionData>, initialState: StateType) => void = 
    <StateType>(context: Scenes.WizardContext<Scenes.WizardSessionData>, initialState: StateType) => {
        for (const key in initialState) (context.wizard.state as any)[key] = initialState[key];
}

export const getSessionState: <StateType>(context: Scenes.WizardContext<Scenes.WizardSessionData>) => StateType = 
    <StateType>(context: Scenes.WizardContext<Scenes.WizardSessionData>) => {
        const state: StateType = context.wizard.state as any;
        return state;
}
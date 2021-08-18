import { Scenes } from "telegraf";

export const getTextMessage = (context: Scenes.WizardContext<Scenes.WizardSessionData>): string => (context.message as any).text;

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
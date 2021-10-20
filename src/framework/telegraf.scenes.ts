import { Middleware, Scenes, Telegraf } from "telegraf";
import { WizardContext, WizardSessionData } from "telegraf/typings/scenes";
import { User } from "typegram";
import { getLocationMessage, getSessionState, getTextMessage, GPSLocation, isLocationMessage, MessageAttachment, readNumber, sendMessage, setSessionState } from "./telegraf.utils";

const createScene = (bot: Telegraf, sceneId: string, words: Array<string | RegExp>, ...steps: Array<Middleware<Scenes.WizardContext>>) => {
    const scene: Scenes.WizardScene<Scenes.WizardContext> = new Scenes.WizardScene<Scenes.WizardContext>(sceneId, ...steps);
    const stage = new Scenes.Stage([scene], {});
    stage.command(['Basta', 'basta'], async (ctx) => {
        await ctx.scene.leave();
        ctx.reply('¡Dale! Dejamos acá');
        return;
    });
    bot.use(stage.middleware() as any);
    bot.hears(words, Scenes.Stage.enter<any>(sceneId));
}

type AfterStepType = 'next' | 'end' | 'repeat' | number;

interface StepDefinitionParams<StateType> {
    sendMessage: (message: string | number, attachments?: MessageAttachment) => void;
    getTextFromMessage: () => string;
    getNumberFromMessage: () => number;
    getLocationFromMessage: () => GPSLocation;
    isLocationMessage: () => boolean;
    state: StateType;
    setState: (newState: StateType) => void;
    user: User;
}

export type StepDefinition<StateType> = (params: StepDefinitionParams<StateType>) => Promise<AfterStepType | void> | AfterStepType | void;

const getStepDefinitionParamsFromContext = <StateType>(context: Scenes.WizardContext<Scenes.WizardSessionData>): StepDefinitionParams<StateType> => ({
    sendMessage: (message: string | number, attachments?: MessageAttachment) => sendMessage(context, message, attachments),
    getTextFromMessage: () => getTextMessage(context),
    getNumberFromMessage: () => readNumber(context),
    state: getSessionState<StateType>(context),
    setState: (newState: StateType) => setSessionState<StateType>(context, newState),
    user: context.message!.from,
    getLocationFromMessage: () => getLocationMessage(context),
    isLocationMessage: () => isLocationMessage(context),
})

const createStep: <StateType>(definition: StepDefinition<StateType>, defaultAfter: AfterStepType) => Middleware<Scenes.WizardContext> =
    <StateType>(definition: StepDefinition<StateType>, defaultAfter: AfterStepType): Middleware<Scenes.WizardContext> => {
        return async (context: WizardContext<WizardSessionData>) => {
            const params: StepDefinitionParams<StateType> = getStepDefinitionParamsFromContext<StateType>(context);
            try {
                const after = await definition(params) ?? defaultAfter;
                switch (after) {
                    case 'repeat': return;
                    case 'next': return context.wizard.next();
                    case 'end': return context.scene.leave();
                    default: if(typeof after === 'number') {
                        return context.wizard.selectStep(context.wizard.cursor + after)
                    }
                }
            } catch (error) {
                context.reply('Ups... Con eso me mataste, perdon');
                context.scene.leave();
            }
        }
    }

export const createSmartScene = <StateType = undefined>(
    bot: Telegraf,
    words: Array<string | RegExp>,
    ...steps: Array<StepDefinition<StateType>>
) => {
    const sceneSteps = steps.map((step, index) => createStep(step, index + 1 === steps.length ? 'end' : 'next'));
    return createScene(bot, Buffer.from(words.join('|')).toString('base64'), words, ...sceneSteps)
}
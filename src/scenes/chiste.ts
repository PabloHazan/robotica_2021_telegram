import axios, { AxiosResponse } from "axios";
import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";

const otro: string = 'Otro';
const basta: string = 'Basta';
const opciones: Array<string> = [otro, basta];

interface IChisteResponse {
    categories: Array<any>,
    created_at: string,
    icon_url: string,
    id: string,
    updated_at: string,
    url: string,
    value: string,
}

export const chiste = (bot: Telegraf) => createSmartScene(
    bot,
    ['chiste'],
    async ({ sendMessage, getTextFromMessage }) => {
        const mensaje = getTextFromMessage();
        if (mensaje === basta) {
            return 'end';
        }
        const response: AxiosResponse<IChisteResponse> = await axios.get<IChisteResponse>('https://api.chucknorris.io/jokes/random');
        const chiste = response.data.value;
        sendMessage(chiste, { options: opciones });
        return 'repeat';
    }
);
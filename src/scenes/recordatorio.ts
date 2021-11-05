import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";
import { Nota } from "../schemas/nota";

export const recordatorio = (bot: Telegraf) => createSmartScene(
    bot,
    ['acordate', 'Acordate'],
    ({sendMessage}) => {
        sendMessage('Dale, que me guardo?');
    },
    async ({ sendMessage, getTextFromMessage, user }) => {
        const text = getTextFromMessage();
        const nota = new Nota({ mensaje: text, userId: user.id });
        await nota.save();
        sendMessage('Listo, me lo acuerdo');
    }
)
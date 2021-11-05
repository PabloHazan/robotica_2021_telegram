import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";
import { Nota } from "../schemas/nota";

export const recordame = (bot: Telegraf) => createSmartScene(
    bot,
    ['recordame', 'Recordame'],
    async ({sendMessage, user}) => {
        const notas = await Nota.find({userId: user.id});
        sendMessage(notas.map(nota => nota.mensaje).join(', '))
    }
);

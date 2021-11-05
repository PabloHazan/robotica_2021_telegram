import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";
import { Pendiente } from '../schemas/pendiente'

export const obtenerPendientes = (bot: Telegraf) => createSmartScene(
    bot,
    ['buscar pendientes', 'Buscar pendientes', 'filtrar pendientes', 'Filtrar pendientes', 'obtener pendientes', 'Obtener pendientes', 'dame los pendientes', 'dame pendientes', 'Dame los pendientes', 'Dame pendientes'],
    ({ sendMessage }) => {
        sendMessage('De que tag?');
    },
    async ({ getTextFromMessage, sendMessage, user }) => {
        const tag: string = getTextFromMessage();
        const pendientes = await Pendiente.find({ tag, userId: user.id });
        sendMessage(`Para el tag ${tag} tenes pendientes las siguientes cosas
        ${pendientes.map(pendiente => pendiente.recordatorio).join(`
        `)}
        `)
    }
);

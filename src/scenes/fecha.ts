import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";

const fechaHora: string = 'Fecha y hora';
const soloFecha: string = 'Solo la fecha';
const soloHora: string = 'Solo la hora';

const opciones: Array<string> = [fechaHora, soloFecha, soloHora];

export const fecha = (bot: Telegraf) => createSmartScene(
    bot,
    ['dia hora'],
    (({ sendMessage }) => {
        sendMessage('¿Qué queres saber?', { options: opciones });
    }),
    ({getTextFromMessage, sendMessage}) => {
        const respuesta = getTextFromMessage();
        const ahora = new Date();
        if (respuesta === fechaHora) {
            sendMessage(ahora.toLocaleString('es-AR'))
        } else if (respuesta === soloFecha) {
            sendMessage(ahora.toLocaleDateString('es-AR'))
        } else if (respuesta === soloHora) {
            sendMessage(ahora.toLocaleTimeString('es-AR'))
        } else {
            sendMessage(`${respuesta} no es una opción válida`, { options: opciones });
            return 'repeat';
        }
    }
)
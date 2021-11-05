import { Telegraf } from "telegraf";
import { createSmartScene } from "../framework/telegraf.scenes";
import { Pendiente } from '../schemas/pendiente';

interface IPendiente {
    recordatorio: string;
    userId: number;
    tag: string;
}

export const crearPendiente = (bot: Telegraf) => createSmartScene<IPendiente>(
    bot,
    ['Agregar pendiente', 'agregar pendiente', 'Agregar nota', 'agregar nota', 'agregar tarea', 'Agregar tarea'],
    ({ sendMessage, user, setState }) => {
        setState({
            recordatorio: '',
            tag: '',
            userId: user.id
        });
        sendMessage('Que nuevo pendiente queres agregar');
    },
    ({ getTextFromMessage, sendMessage, state }) => {
        state.recordatorio = getTextFromMessage();
        sendMessage('¿En que tag lo queres recordar?');
    },
    async ({ getTextFromMessage, sendMessage, state }) => {
        state.tag = getTextFromMessage();
        const pendiente = new Pendiente({
            recordatorio: state.recordatorio,
            userId: state.userId,
            tag: state.tag,
        });
        await pendiente.save();
        sendMessage('Guardado!');
    }

);
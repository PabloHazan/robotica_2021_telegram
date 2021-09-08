import { Telegraf } from 'telegraf'
import { createSmartScene } from '../framework/telegraf.scenes';


export const saludar = (bot: Telegraf) => createSmartScene<void>(
    bot,
    ['hola', 'che', 'buenas', '¿como estas?', 'Hola'],
    ({ sendMessage }) => {
        sendMessage('¡Hola! ¿Como estas?');
    }
)
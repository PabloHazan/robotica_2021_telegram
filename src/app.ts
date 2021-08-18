import { Telegraf, session } from 'telegraf'
import { saludar } from './scenes/saludar';

export const app = (bot: Telegraf) => {
    bot.use(session());
    saludar(bot);

    bot.on('text', (context,) => {
        context.reply('No se que hacer con eso');
    })
}


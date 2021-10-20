import { Telegraf, session } from 'telegraf'
import { chiste } from './scenes/chiste';
import { clima } from './scenes/clima';
import { fecha } from './scenes/fecha';
import { numeros } from './scenes/numeros';
import { saludar } from './scenes/saludar';

export const app = (bot: Telegraf) => {
    bot.use(session());
    saludar(bot);
    fecha(bot);
    numeros(bot);
    chiste(bot);
    clima(bot);

    bot.on('text', (context,) => {
        context.reply('No se que hacer con eso');
    })
}


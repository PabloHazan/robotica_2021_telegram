import { Telegraf, session } from 'telegraf'
import { crearPendiente } from './scenes/agregarPendiente';
import { chiste } from './scenes/chiste';
import { clima } from './scenes/clima';
import { fecha } from './scenes/fecha';
import { numeros } from './scenes/numeros';
import { obtenerPendientes } from './scenes/obtenerPendientes';
import { recordame } from './scenes/recordame';
import { recordatorio } from './scenes/recordatorio';
import { saludar } from './scenes/saludar';

export const app = (bot: Telegraf) => {
    bot.use(session());
    saludar(bot);
    fecha(bot);
    numeros(bot);
    chiste(bot);
    clima(bot);
    recordatorio(bot);
    recordame(bot);
    crearPendiente(bot);
    obtenerPendientes(bot);

    bot.on('text', (context,) => {
        context.reply('No se que hacer con eso');
    })
}


import { Telegraf } from "telegraf";
import { app } from "./app";
import server from "./server";

export const bot: Telegraf = new Telegraf(process.env.BOT_TOKEN!);

export const launchBot = () => {
    app(bot);
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
    if (process.env.BOT_HOST && process.env.BOT_WEB_HOOK) {
        server.listen(process.env.PORT || 8080, () => {
            console.log('Bot iniciado en servidor productivo');
            bot.telegram.setWebhook(process.env.BOT_HOST! + process.env.BOT_WEB_HOOK!);
        })
    } else {
        bot.launch();
        console.log('Bot iniciado en entorno de desarrollo local');
    }
}

import { Telegraf } from "telegraf";
import { app } from "./app";
import { initDb } from "./db";
import createServer from "./server";

export const bot: Telegraf = new Telegraf(process.env.BOT_TOKEN!);

export const launchBot = async () => {
    if (process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER && process.env.DB_PASS) await initDb();
    app(bot);
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
    if (process.env.BOT_HOST && process.env.BOT_WEB_HOOK) {
        
        createServer(bot).listen(process.env.PORT || 8080, () => {
            console.log('Bot iniciado en servidor productivo');
            bot.telegram.setWebhook(process.env.BOT_HOST! + process.env.BOT_WEB_HOOK!);
        })
    } else {
        bot.launch();
        console.log('Bot iniciado en entorno de desarrollo local');
    }
}

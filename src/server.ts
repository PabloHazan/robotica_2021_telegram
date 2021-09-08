import express, { Express } from 'express';
import { Telegraf } from 'telegraf';

const initServer = (bot: Telegraf) => {
    const server: Express = express();
    if (process.env.BOT_WEB_HOOK) {
        server.use(bot.webhookCallback(process.env.BOT_WEB_HOOK))
    }

    return server;
}

export default initServer;

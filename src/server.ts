import express, { Express } from 'express';
import { bot } from './bot';

const server: Express = express();

if (process.env.BOT_WEB_HOOK) {
    server.use(bot.webhookCallback(process.env.BOT_WEB_HOOK))
}

export default server;
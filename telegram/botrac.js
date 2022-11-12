
process.env.NTBA_FIX_319 = 1;
const TelegramBot = require('node-telegram-bot-api');
const token = '5064549590:AAHEOKi4eJ6YYPTD5b2ScF098w2RicsTz24';

const bot = new TelegramBot(token, { polling: true });

module.exports = bot
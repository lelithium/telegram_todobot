const db = require('./db');
const Telegraf = require('telegraf');

const { TELEGRAM_TOKEN } = require('./secrets.js');

const bot = new Telegraf(TELEGRAM_TOKEN);

const addItem = (text) => {
  const item = {
    stamp: Date.now(),
    text,
  };
  return db.newItem(item);
};

bot.start((ctx) => {
  console.log('started:', ctx.from.id);
  return ctx.reply('Welcome!');
});
bot.command('add', (ctx) => {
  const text = ctx.message.text
    .split(' ')
    .slice(1)
    .join(' ');
  addItem(text)
    .then(ctx.replyWithMarkdown(`Added item \`${text}\``))
    .catch(err => ctx.reply(`An error occured ${err}`));
});
bot.command('get', (ctx) => {
  db.getItems.then((docs) => {
    docs.forEach(item => ctx.reply(item.text));
  });
});
bot.startPolling();

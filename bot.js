const Telegraf = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');

const db = require('./db');

const { TELEGRAM_TOKEN, TELEGRAM_USER } = require('./secrets.js');

const bot = new Telegraf(TELEGRAM_TOKEN);

const itemKeyboard = Markup.inlineKeyboard([Markup.callbackButton('Done', 'done')]);

const addItem = (text) => {
  const item = {
    stamp: String(Date.now()),
    text,
  };
  return db.newItem(item);
};

const formatItem = item => `${item.text} since ${Date(Number(item.stamp))} - ${item.stamp}`;

bot.start(ctx => ctx.reply('Welcome!'));
bot.command('add', (ctx) => {
  if (String(ctx.from.id) !== TELEGRAM_USER) {
    ctx.reply('Wrong user ID');
    return;
  }
  const text = ctx.message.text
    .split(' ')
    .slice(1)
    .join(' ');
  if (!text) {
    ctx.reply('No ToDo item ?');
    return;
  }
  addItem(text)
    .then(ctx.replyWithMarkdown(`Added item \`${text}\``))
    .catch(err => ctx.reply(`An error occured ${err.text}`));
});

bot.command('get', (ctx) => {
  if (String(ctx.from.id) !== TELEGRAM_USER) {
    ctx.reply('Wrong user ID');
    return;
  }
  db
    .getItems()
    .then((docs) => {
      if (!docs) {
        ctx.reply('No ToDo items !');
        return;
      }
      docs.forEach(item => ctx.reply(formatItem(item), Extra.markup(itemKeyboard)));
    })
    .catch(err => ctx.reply(`An error occured ${err.text}`));
});

bot.action('done', (ctx) => {
  const stamp = ctx.callbackQuery.message.text.split(' ').slice(-1)[0];
  db.deleteItem(stamp).catch((err) => {
    ctx.reply(`An error occured ${err.text}`);
    console.log(err);
  });
  return ctx.deleteMessage();
});

bot.startPolling();

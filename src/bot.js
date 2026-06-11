require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  await ctx.reply(
    "سلام 👋\nبه ربات خوش اومدی."
  );
});

bot.launch();

console.log("Bot Started");
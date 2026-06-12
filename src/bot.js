require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  return ctx.reply(
    "🏠 به ربات فروش خوش آمدید\nیکی از گزینه‌ها را انتخاب کنید:",
    Markup.keyboard([
      ["🛒 خرید سرویس", "👤 حساب کاربری"],
      ["💰 کیف پول", "📞 پشتیبانی"]
    ]).resize()
  );
});

bot.launch();

console.log("Bot Started");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
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

bot.hears("🛒 خرید سرویس", (ctx) => {
  ctx.reply("🛒 لیست سرویس‌ها به زودی اینجا نمایش داده می‌شود");
});

bot.hears("👤 حساب کاربری", (ctx) => {
  ctx.reply("👤 اطلاعات حساب شما در اینجا نمایش داده می‌شود");
});

bot.hears("💰 کیف پول", (ctx) => {
  ctx.reply("💰 موجودی کیف پول شما: 0 تومان");
});

bot.hears("📞 پشتیبانی", (ctx) => {
  ctx.reply("📞 برای پشتیبانی پیام دهید: @support");
});

bot.launch();

console.log("Bot Started");

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
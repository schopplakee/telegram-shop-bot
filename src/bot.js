require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

require("./commands/start")(bot);

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

(async () => {
  try {
    await bot.launch();
    console.log("✅ Bot Started");
  } catch (err) {
    console.error("Launch Error:", err);
  }
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
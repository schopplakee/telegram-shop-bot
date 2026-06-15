require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

// Commands
require("./commands/start")(bot);

// ===== دکمه‌ها =====

bot.hears("🛒 خرید سرویس جدید", async (ctx) => {
  await ctx.reply("🛒 لیست سرویس‌ها به زودی اینجا نمایش داده می‌شود.");
});

bot.hears("💰 کیف پول من", async (ctx) => {
  await ctx.reply("💰 موجودی کیف پول شما: 0 تومان");
});

bot.hears("👤 سرویس‌های من", async (ctx) => {
  await ctx.reply("👤 هنوز سرویسی برای شما ثبت نشده است.");
});

bot.hears("💡 آموزش استفاده", async (ctx) => {
  await ctx.reply("📚 آموزش استفاده به زودی اضافه می‌شود.");
});

bot.hears("📞 معرفی به دوستان", async (ctx) => {
  await ctx.reply("🎁 سیستم معرفی دوستان به زودی فعال می‌شود.");
});

bot.hears("🧑‍💻 تیکت پشتیبانی", async (ctx) => {
  await ctx.reply("📞 برای پشتیبانی با @support در ارتباط باشید.");
});

// ===== اجرای ربات =====

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
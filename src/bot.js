const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

require("dotenv").config();

const { Telegraf, Markup } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(async (ctx) => {
  const user = ctx.from;

  
  await prisma.user.upsert({
    where: { telegramId: String(user.id) },
    update: {},
    create: {
      telegramId: String(user.id),
      username: user.username,
      firstName: user.first_name,
    },
  });

  return ctx.reply(
    "🏠 به ربات خوش آمدید",
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
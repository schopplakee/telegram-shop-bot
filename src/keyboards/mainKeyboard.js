const { Markup } = require("telegraf");

const mainKeyboard = Markup.keyboard([
  ["🛒 خرید سرویس جدید"],
  ["💰 کیف پول من", "👤 سرویس‌های من"],
  ["💡 آموزش استفاده", "📞 معرفی به دوستان"],
  ["🧑‍💻 تیکت پشتیبانی"]
]).resize();

module.exports = mainKeyboard;
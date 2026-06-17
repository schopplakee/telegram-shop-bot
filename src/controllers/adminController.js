const adminKeyboard = require("../keyboards/adminKeyboard");
const countryAdminKeyboard = require("../keyboards/countryAdminKeyboard");

module.exports = {
  async countries(ctx) {
    return ctx.reply(
      "🌍 مدیریت کشورها",
      countryAdminKeyboard,
    );
  },

  async servers(ctx) {
    return ctx.reply("🖥 مدیریت سرورها");
  },

  async plans(ctx) {
    return ctx.reply("📦 مدیریت پلن‌ها");
  },

  async users(ctx) {
    return ctx.reply("👥 مدیریت کاربران");
  },

  async transactions(ctx) {
    return ctx.reply("💰 مدیریت تراکنش‌ها");
  },

  async discounts(ctx) {
    return ctx.reply("🎁 مدیریت کد تخفیف");
  },

  async settings(ctx) {
    return ctx.reply("⚙ تنظیمات");
  },

  async stats(ctx) {
    return ctx.reply("📊 آمار");
  },

  async broadcast(ctx) {
    return ctx.reply("📨 پیام همگانی");
  },

  async back(ctx) {
    return ctx.reply(
      "👑 پنل مدیریت",
      adminKeyboard,
    );
  },
};

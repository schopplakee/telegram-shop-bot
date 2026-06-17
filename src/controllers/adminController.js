const adminKeyboard = require("../keyboards/adminKeyboard");
const sessionManager = require("../sessions/sessionManager");

const countryAdminKeyboard = require("../keyboards/countryAdminKeyboard");
const serverAdminKeyboard = require("../keyboards/serverAdminKeyboard");

async function back(ctx) {
  await sessionManager.clear(ctx.from.id);

  return ctx.reply("👑 پنل مدیریت", adminKeyboard);
}

module.exports = {
  async countries(ctx) {
    return ctx.reply("🌍 مدیریت کشورها", countryAdminKeyboard);
  },

  async servers(ctx) {
    return ctx.reply("🖥 مدیریت سرورها", serverAdminKeyboard);
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

  back,
};

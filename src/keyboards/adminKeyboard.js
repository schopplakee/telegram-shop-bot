const { Markup } = require("telegraf");

module.exports = Markup.keyboard([
    ["🌍 مدیریت کشورها", "🖥 مدیریت سرورها"],
    ["📦 مدیریت پلن‌ها", "🔗 مدیریت پنل‌ها"],
    ["👥 کاربران", "💳 تراکنش‌ها"],
    ["📊 آمار", "⚙ تنظیمات"]
]).resize();
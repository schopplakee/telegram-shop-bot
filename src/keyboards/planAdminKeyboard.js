const { Markup } = require("telegraf");

module.exports = Markup.keyboard([
    ["➕ افزودن پلن"],
    ["📋 لیست پلن‌ها"],
    ["⬅️ بازگشت"]
]).resize();
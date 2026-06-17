const { Markup } = require("telegraf");

module.exports = Markup.keyboard([
  ["➕ افزودن سرور"],
  ["📋 لیست سرورها"],
  ["⬅️ بازگشت"],
])
  .resize()
  .persistent();

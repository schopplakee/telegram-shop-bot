const { Markup } = require("telegraf");

module.exports = Markup.keyboard([
  ["➕ افزودن کشور"],
  ["📋 لیست کشورها"],
  ["⬅️ بازگشت"],
])
  .resize()
  .persistent();

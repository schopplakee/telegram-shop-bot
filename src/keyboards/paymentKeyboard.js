const { Markup } = require("telegraf");

module.exports = Markup.inlineKeyboard([
  [Markup.button.callback("💳 درگاه پرداخت", "payment_gateway")],

  [Markup.button.callback("🏦 کارت به کارت", "payment_card")],

  [Markup.button.callback("👛 کیف پول", "payment_wallet")],

  [Markup.button.callback("⬅️ بازگشت", "purchase_back_to_plans")],
]);

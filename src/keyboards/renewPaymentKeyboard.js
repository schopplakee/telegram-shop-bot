const { Markup } = require("telegraf");

module.exports = (serviceId) =>
  Markup.inlineKeyboard([
    [Markup.button.callback("🏦 کارت به کارت", `renew_card:${serviceId}`)],
    [Markup.button.callback("👛 کیف پول", `wallet_renew:${serviceId}`)],
  ]);

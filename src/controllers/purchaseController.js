const purchaseKeyboard = require("../keyboards/purchaseKeyboard");

async function startPurchase(ctx) {

  return ctx.reply(
    "🌍 کشور موردنظر را انتخاب کنید:",
    purchaseKeyboard.countryKeyboard()
  );

}

module.exports = {
  startPurchase,
};
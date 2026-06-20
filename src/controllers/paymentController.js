const paymentKeyboard = require("../keyboards/paymentKeyboard");

module.exports = {
  async select(ctx) {
    return ctx.editMessageText(
      "💳 روش پرداخت را انتخاب کنید.",

      paymentKeyboard,
    );
  },

  async gateway(ctx) {
    return ctx.answerCbQuery("🚧 در حال پیاده‌سازی");
  },

  async card(ctx) {
    return ctx.answerCbQuery("🚧 در حال پیاده‌سازی");
  },

  async wallet(ctx) {
    return ctx.answerCbQuery("🚧 در حال پیاده‌سازی");
  },
};

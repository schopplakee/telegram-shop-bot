const paymentKeyboard = require("../keyboards/paymentKeyboard");

const userService = require("../services/userService");
const planService = require("../services/planService");
const walletService = require("../services/walletService");
const xuiService = require("../services/xuiService");
const orderService = require("../services/orderService");
const purchaseService = require("../services/purchaseService");

const sessionManager = require("../sessions/sessionManager");

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
    const session = await sessionManager.get(ctx.from.id);

    if (!session || !session.data) {
      return ctx.editMessageText("❌ اطلاعات خرید پیدا نشد.");
    }

    const { serverId, planId } = session.data;

    try {
      await ctx.editMessageText("⏳ در حال ساخت سرویس...");

      const result = await purchaseService.purchaseWithWallet(
        serverId,
        planId,
        ctx.from.id,
      );

      await sessionManager.clear(ctx.from.id);

      return ctx.editMessageText(
        `✅ سرویس شما با موفقیت ساخته شد.

🌍 ${result.server.country.flag} ${result.server.country.name}

📦 ${result.plan.name}

📧 ${result.client.email}

🔗 لینک اتصال:

${result.subscriptionUrl}`,
      );
    } catch (err) {
      console.error(err);

      if (err.message === "NOT_ENOUGH_BALANCE") {
        return ctx.editMessageText("❌ موجودی کیف پول کافی نیست.");
      }

      return ctx.editMessageText("❌ خطا در ساخت سرویس.");
    }
  },
};

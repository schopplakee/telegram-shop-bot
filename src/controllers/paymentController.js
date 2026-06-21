const paymentKeyboard = require("../keyboards/paymentKeyboard");

const userService = require("../services/userService");
const planService = require("../services/planService");
const walletService = require("../services/walletService");
const xuiService = require("../services/xuiService");
// const serverService = require("../services/serverService");
const orderService = require("../services/orderService");
// const clientService = require("../services/clientService");

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

    const {
      serverId,

      planId,
    } = session.data;

    const user = await userService.getByTelegramId(ctx.from.id);

    const plan = await planService.getPlan(planId);

    if (!user || !plan) {
      return ctx.editMessageText("❌ اطلاعات کاربر یا پلن یافت نشد.");
    }

    if (user.balance < plan.price) {
      return ctx.editMessageText("❌ موجودی کیف پول کافی نیست.");
    }

    await ctx.editMessageText("⏳ در حال ایجاد سرویس...");

    await walletService.decrease(
      user,

      plan.price,

      `خرید پلن ${plan.name}`,
    );

    await orderService.create({
      userId: user.id,

      amount: plan.price,

      paymentMethod: "WALLET",

      status: "SUCCESS",
    });

    // const result = await xuiService.createClient({
    //   inboundId: (await serverService.getServer(serverId)).inboundId,

    //   email: Math.random().toString(36).substring(2, 10),

    //   totalGB: plan.traffic * 1024 * 1024 * 1024,

    //   expiryTime: Date.now() + plan.days * 24 * 60 * 60 * 1000,
    // });

    // await clientService.create({
    //   userId: user.id,

    //   serverId,

    //   planId,

    //   uuid: result.client.id,

    //   email: result.client.email,

    //   subscriptionUrl: "",

    //   expireAt: new Date(result.client.expiryTime),

    //   trafficLimit: result.client.totalGB,
    // });

    await sessionManager.clear(ctx.from.id);

    return ctx.editMessageText(
      `✅ سرویس شما ساخته شد.

// 📧 ${result.client.email}
// 🆔 ${result.client.id}

به زودی لینک اتصال نیز نمایش داده خواهد شد.`,
    );
  },
};

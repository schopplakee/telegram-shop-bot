const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const paymentKeyboard = require("../keyboards/paymentKeyboard");

const userService = require("../services/userService");
const planService = require("../services/planService");
const walletService = require("../services/walletService");
const xuiService = require("../services/xuiService");
const orderService = require("../services/orderService");
const purchaseService = require("../services/purchaseService");
const clientService = require("../services/clientService");

const sessionManager = require("../sessions/sessionManager");

async function walletRenew(ctx, serviceId) {
  const telegramId = String(ctx.from.id);

  const user = await prisma.user.findUnique({
    where: {
      telegramId,
    },
  });

  if (!user) {
    return ctx.answerCbQuery("کاربر پیدا نشد");
  }

  const service = await clientService.get(serviceId);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const amount = service.plan.price;

  if (user.balance < amount) {
    return ctx.reply("❌ موجودی کیف پول کافی نیست.");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });

  await prisma.walletTransaction.create({
    data: {
      userId: user.id,
      amount,
      type: "DEBIT",
      description: `تمدید سرویس #${service.id}`,
    },
  });

  const expire =
    new Date(service.expireAt) > new Date()
      ? new Date(service.expireAt)
      : new Date();

  expire.setDate(expire.getDate() + service.plan.days);

  await prisma.service.update({
    where: {
      id: service.id,
    },
    data: {
      expireAt: expire,
    },
  });

  const result = await xuiService.extendClient(service.email, expire.getTime());

  if (!result.success) {
    throw new Error("UPDATE_FAILED");
  }

  await ctx.answerCbQuery();

  return ctx.reply(
    `✅ سرویس با موفقیت تمدید شد.

💰 مبلغ:
${amount.toLocaleString("fa-IR")} تومان

📅 اعتبار جدید:

${expire.toLocaleDateString("fa-IR")}`,
  );
}

async function cardRenew(ctx, serviceId) {
  await sessionManager.start(ctx.from.id, "renew", "waiting_card_receipt", {
    serviceId,
  });

  await ctx.answerCbQuery();

  return ctx.reply(
    `🏦 پرداخت کارت به کارت

شماره کارت:

6037-9975-xxxx-xxxx

پس از پرداخت، تصویر رسید را ارسال کنید.`,
  );
}

async function receiveRenewReceipt(ctx) {
  const session = await sessionManager.get(ctx.from.id);

  if (!session || session.step !== "renew_card_receipt") {
    return;
  }

  if (!ctx.message.photo) {
    return ctx.reply("❌ لطفاً تصویر رسید را ارسال کنید.");
  }

  const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;

  const service = await clientService.get(session.data.serviceId);

  await ctx.telegram.sendPhoto(process.env.ADMIN_ID, photo, {
    caption: `🧾 درخواست تمدید سرویس

👤 ${ctx.from.first_name}
🆔 ${ctx.from.id}

📧 ${service.email}

💰 ${service.plan.price.toLocaleString("fa-IR")} تومان`,
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "✅ تایید",
            callback_data: `renew_accept:${service.id}:${ctx.from.id}`,
          },
          {
            text: "❌ رد",
            callback_data: `renew_reject:${service.id}:${ctx.from.id}`,
          },
        ],
      ],
    },
  });

  await sessionManager.clear(ctx.from.id);

  return ctx.reply("✅ رسید ثبت شد و منتظر تایید مدیر است.");
}

async function acceptRenew(ctx, serviceId, telegramId) {
  const service = await clientService.get(serviceId);

  const expire =
    new Date(service.expireAt) > new Date()
      ? new Date(service.expireAt)
      : new Date();

  expire.setDate(expire.getDate() + service.plan.days);

  await prisma.service.update({
    where: {
      id: service.id,
    },
    data: {
      expireAt: expire,
    },
  });

  await xuiService.extendClient(service.email, expire.getTime());

  await ctx.telegram.sendMessage(
    telegramId,
    `✅ پرداخت شما تایید شد.

سرویس با موفقیت تمدید گردید.`,
  );

  await ctx.answerCbQuery("تایید شد");

  return ctx.editMessageCaption({
    caption: "✅ تایید شد",
  });
}

async function rejectRenew(ctx, serviceId, telegramId) {
  await ctx.telegram.sendMessage(telegramId, "❌ پرداخت شما توسط مدیر رد شد.");

  await ctx.answerCbQuery("رد شد");

  return ctx.editMessageCaption({
    caption: "❌ رد شد",
  });
}

async function receiptUploaded(ctx) {
  await ctx.reply(
    "✅ رسید شما دریافت شد.\n\nپس از تایید مدیر، سرویس به صورت خودکار تمدید خواهد شد.",
  );
}

async function adminRenewApprove(ctx, serviceId, userId) {
  const service = await clientService.get(serviceId);

  const expire =
    new Date(service.expireAt) > new Date()
      ? new Date(service.expireAt)
      : new Date();

  expire.setDate(expire.getDate() + service.plan.days);

  await clientService.update(service.id, {
    expireAt: expire,
  });

  await xuiService.extendClient(service.email, expire.getTime());

  await ctx.editMessageCaption(
    ctx.update.callback_query.message.caption + "\n\n✅ تایید شد",
  );

  await ctx.telegram.sendMessage(
    userId,
    `✅ پرداخت شما تایید شد.

سرویس با موفقیت تمدید شد.

اعتبار جدید:

${expire.toLocaleDateString("fa-IR")}`,
  );

  return ctx.answerCbQuery("تایید شد");
}

async function adminRenewReject(ctx, userId) {
  await ctx.editMessageCaption(
    ctx.update.callback_query.message.caption + "\n\n❌ رد شد",
  );

  await ctx.telegram.sendMessage(userId, "❌ رسید پرداخت توسط مدیر رد شد.");

  return ctx.answerCbQuery("رد شد");
}

module.exports = {
  ...receiptUploaded,
};

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

  walletRenew,
  cardRenew,
  receiveRenewReceipt,
  acceptRenew,
  rejectRenew,
  receiptUploaded,
  adminRenewApprove,
  adminRenewReject,
};

const QRCode = require("qrcode");

const userService = require("../services/userService");
const clientService = require("../services/clientService");

const keyboard = require("../keyboards/myServicesKeyboard");
const serviceKeyboard = require("../keyboards/serviceKeyboard");
const xuiService = require("../services/xuiService");

async function show(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const { client } = await xuiService.getClientStats(service.email);

  const text = `
🌍 ${service.server.country.flag} ${service.server.country.name}

👤 نام کاربری
${service.email}

📦 پلن
${service.plan.name}

📅 زمان خرید
${service.createdAt.toLocaleString("fa-IR")}

📡 آخرین اتصال
-

📊 حجم
${Number(service.trafficLimit) / 1024 / 1024 / 1024} GB

⏳ اعتبار
${service.plan.days} روز

${client.enable ? "🟢 فعال" : "🔴 غیرفعال"}
`;

  return ctx.editMessageText(text, {
    reply_markup: serviceKeyboard(service.id, client.enable).reply_markup,
  });
}

async function refresh(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const { stat, client } = await xuiService.getClientStats(service.email);

  const used = Number(stat.up) + Number(stat.down);

  const remainDays = Math.max(
    0,
    Math.ceil((new Date(service.expireAt) - Date.now()) / 86400000),
  );

  const text = `
🌍 ${service.server.country.flag} ${service.server.country.name}

👤 نام کاربری
${service.email}

📦 پلن
${service.plan.name}

📅 زمان خرید
${service.createdAt.toLocaleString("fa-IR")}

📡 آخرین اتصال
${
  stat.lastOnline ? new Date(stat.lastOnline).toLocaleString("fa-IR") : "نداشته"
}

📊 حجم
${(used / 1024 / 1024 / 1024).toFixed(2)}
/
${(Number(service.trafficLimit) / 1024 / 1024 / 1024).toFixed(2)}
GB

⏳ اعتبار
${remainDays} روز

${client.enable ? "🟢 فعال" : "🔴 غیرفعال"}
`;

  try {
    return await ctx.editMessageText(text, {
      reply_markup: serviceKeyboard(service.id, client.enable).reply_markup,
    });
  } catch (e) {
    if (e.description && e.description.includes("message is not modified")) {
      return ctx.answerCbQuery("بدون تغییر");
    }

    throw e;
  }
}

async function subscription(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  await ctx.answerCbQuery();

  return ctx.reply(
    `🔗 لینک اشتراک

${service.subscriptionUrl}`,
  );
}

async function qr(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  await ctx.answerCbQuery();

  const buffer = await QRCode.toBuffer(service.subscriptionUrl, {
    type: "png",
    width: 600,
    margin: 2,
  });

  return ctx.replyWithPhoto(
    {
      source: buffer,
    },
    {
      caption: "📷 QR Code سرویس",
    },
  );
}

async function configs(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const config = await xuiService.getClientConfig(service.email);

  await ctx.answerCbQuery();

  return ctx.reply(`<code>${config}</code>`, {
    parse_mode: "HTML",
  });
}

async function toggle(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const { client } = await xuiService.getClientStats(service.email);

  const enable = !client.enable;

  await xuiService.toggleClient(service.email, enable);

  await ctx.answerCbQuery(enable ? "✅ سرویس فعال شد" : "⛔ سرویس متوقف شد");

  return refresh(ctx, id);
}

async function renew(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  await ctx.answerCbQuery();

  return ctx.reply(
    `💳 تمدید سرویس

پلن فعلی:
${service.plan.name}

برای تمدید یکی از پلن‌های زیر را انتخاب کنید.`,
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "📅 تمدید همین پلن",
              callback_data: `renew_plan:${service.id}`,
            },
          ],
        ],
      },
    },
  );
}

async function remove(ctx, id) {
  await ctx.answerCbQuery();

  return ctx.editMessageReplyMarkup({
    inline_keyboard: [
      [
        {
          text: "✅ حذف شود",
          callback_data: `confirm_delete:${id}`,
        },
      ],
      [
        {
          text: "❌ انصراف",
          callback_data: `service:${id}`,
        },
      ],
    ],
  });
}

async function confirmDelete(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const result = await xuiService.deleteClient(service.email);

  console.log(result);

  if (!result.success) {
    return ctx.answerCbQuery("حذف داخل پنل انجام نشد");
  }

  await clientService.remove(service.id);

  await ctx.answerCbQuery("✅ حذف شد");

  return ctx.editMessageText("✅ سرویس حذف شد.");
}

async function newSubscription(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const config = await xuiService.getClientConfig(service.email);

  await ctx.answerCbQuery("✅ لینک دریافت شد");

  return ctx.reply(
    `🔗 لینک اشتراک جدید

${config}`,
  );
}

module.exports = {
  async list(ctx) {
    const user = await userService.getByTelegramId(ctx.from.id);

    const services = await clientService.getByUser(user.id);

    if (!services.length) {
      return ctx.reply("❌ هنوز سرویسی ندارید.");
    }

    return ctx.reply("📦 سرویس‌های شما:", keyboard(services));
  },

  show,
  refresh,
  subscription,
  qr,
  configs,
  toggle,
  renew,
  remove,
  confirmDelete,
  newSubscription,
};

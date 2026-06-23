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

🟢 وضعیت
فعال
`;

  return ctx.editMessageText(text, {
    reply_markup: serviceKeyboard(service).reply_markup,
  });
}

async function refresh(ctx, id) {
  const service = await clientService.get(id);

  if (!service) {
    return ctx.answerCbQuery("سرویس پیدا نشد");
  }

  const { stat } = await xuiService.getClientStats(service.email);

  const used = Number(stat.up) + Number(stat.down);

  const remain = Number(service.trafficLimit) - used;

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

${stat.enable ? "🟢 فعال" : "🔴 غیرفعال"}
`;

  return ctx.editMessageText(text, {
    reply_markup: serviceKeyboard(service).reply_markup,
  });
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

  await ctx.answerCbQuery();

  const text = `📥 کانفیگ‌های سرویس

🔗 Subscription

${service.subscriptionUrl}

━━━━━━━━━━━━━━

📱 برنامه‌های پیشنهادی

🤖 Android
• Hiddify Next
• Nekobox
• v2rayNG

🍏 iPhone
• Streisand
• Hiddify Next

🖥 Windows
• Hiddify Next
• Nekoray

🍎 macOS
• Hiddify Next

🐧 Linux
• Hiddify Next

کافی است لینک بالا را داخل برنامه Import کنید.`;

  return ctx.reply(text);
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

  async toggle(ctx) {
    const id = Number(ctx.match[1]);

    const service = await clientService.get(id);

    if (!service) {
      return ctx.answerCbQuery("سرویس پیدا نشد");
    }

    const stats = await xuiService.getClientStats(service.email);

    const enable = !stats.client.enable;

    await xuiService.toggleClient(service.client.id, enable);

    await ctx.answerCbQuery(
      enable ? "✅ سرویس فعال شد" : "⛔ سرویس غیرفعال شد",
    );

    return this.refresh(ctx, id);
  },

  show,
  refresh,
  subscription,
  qr,
  configs,
};

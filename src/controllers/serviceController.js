const userService = require("../services/userService");
const clientService = require("../services/clientService");

const keyboard = require("../keyboards/myServicesKeyboard");
const serviceKeyboard = require("../keyboards/serviceKeyboard");

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
    reply_markup: serviceKeyboard(service.id).reply_markup,
  });
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
};

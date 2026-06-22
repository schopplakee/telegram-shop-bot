const userService = require("../services/userService");
const clientService = require("../services/clientService");

const keyboard = require("../keyboards/myServicesKeyboard");

module.exports = {
  async list(ctx) {
    const user = await userService.getByTelegramId(ctx.from.id);

    const services = await clientService.getByUser(user.id);

    if (!services.length) {
      return ctx.reply("❌ هنوز سرویسی ندارید.");
    }

    return ctx.reply("📦 سرویس‌های شما:", keyboard(services));
  },
};

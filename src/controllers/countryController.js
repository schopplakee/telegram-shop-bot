const sessionManager = require("../sessions/sessionManager");
const countryService = require("../services/countryService");

const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = {
  async addCountry(ctx) {
    await sessionManager.start(
      ctx.from.id,

      SESSION_MODULES.COUNTRY,

      SESSION_STEPS.NAME,
    );

    return ctx.reply("🌍 لطفاً نام کشور را وارد کنید.");
  },

  async listCountries(ctx) {
    const countries = await countryService.getCountries();

    if (!countries.length) {
      return ctx.reply("❌ هنوز کشوری ثبت نشده است.");
    }

    let message = "🌍 لیست کشورها\n\n";

    countries.forEach((country, index) => {
      message += `${index + 1}. ${country.flag} ${country.name} (${country.code})\n`;
    });

    return ctx.reply(message);
  },
};

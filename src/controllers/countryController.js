const sessionManager = require("../sessions/sessionManager");
const countryService = require("../services/countryService");
const countryListKeyboard = require("../keyboards/countryListKeyboard");

const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = {
  async addCountry(ctx) {
    await sessionManager.start(
      ctx.from.id,

      SESSION_MODULES.COUNTRY,

      SESSION_STEPS.NAME,
    );

    const { Markup } = require("telegraf");

    return ctx.reply(
      "🌍 لطفاً نام کشور را وارد کنید.",

      Markup.keyboard([["❌ لغو"]]).resize(),
    );
  },

  async listCountries(ctx) {
    const countries = await countryService.getCountries();

    if (!countries.length) {
      return ctx.reply("❌ هنوز کشوری ثبت نشده است.");
    }

    return ctx.reply(
      "🌍 کشورهای ثبت شده:",

      countryListKeyboard(countries),
    );
  },
};

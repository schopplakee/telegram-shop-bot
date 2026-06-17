const sessionManager = require("../sessions/sessionManager");

const countryService = require("../services/countryService");

const countryListKeyboard = require("../keyboards/countryListKeyboard");
const countryAdminKeyboard = require("../keyboards/countryAdminKeyboard");

const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = {
  async addCountry(ctx) {
    await sessionManager.start(
      ctx.from.id,

      SESSION_MODULES.COUNTRY,

      SESSION_STEPS.NAME,

      {},
    );

    return ctx.reply(
      "🌍 نام کشور را وارد کنید.",

      {
        reply_markup: {
          keyboard: [["❌ لغو"]],
          resize_keyboard: true,
        },
      },
    );
  },

  async listCountries(ctx) {
    const countries = await countryService.getCountries();

    if (!countries.length) {
      return ctx.reply(
        "❌ هنوز کشوری ثبت نشده است.",

        countryAdminKeyboard,
      );
    }

    return ctx.reply(
      "🌍 کشورهای ثبت شده:",

      countryListKeyboard(countries),
    );
  },

  async cancel(ctx) {
    await sessionManager.clear(ctx.from.id);

    return ctx.reply(
      "🌍 مدیریت کشورها",

      countryAdminKeyboard,
    );
  },
};

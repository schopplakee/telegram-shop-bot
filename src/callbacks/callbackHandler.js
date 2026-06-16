const ACTION = require("../constants/callbackActions");

const serverService = require("../services/serverService");
const planService = require("../services/planService");
const countryService = require("../services/countryService");
const countryListKeyboard = require("../keyboards/countryListKeyboard");

const { serverKeyboard } = require("../keyboards/serverKeyboard");
const { planKeyboard } = require("../keyboards/planKeyboard");

module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;

  const [action, id] = data.split(":");

  await ctx.answerCbQuery();

  switch (action) {
    case ACTION.COUNTRY: {
      const servers = await serverService.getServers(Number(id));

      return ctx.editMessageText(
        "🖥 سرور موردنظر را انتخاب کنید:",

        serverKeyboard(servers),
      );
    }

    case ACTION.SERVER: {
      const plans = await planService.getPlans(Number(id));

      return ctx.editMessageText(
        "📦 پلن موردنظر را انتخاب کنید:",

        planKeyboard(plans),
      );
    }

    case ACTION.PLAN: {
      return ctx.editMessageText(
        `✅ پلن شماره ${id} انتخاب شد.\n\nمرحله بعد: انتخاب روش پرداخت`,
      );
    }

    case "country": {
      const country = await countryService.getCountry(Number(id));

      return ctx.editMessageText(
        `🌍 ${country.flag} ${country.name}

      کد: ${country.code}

      یکی از گزینه‌ها را انتخاب کنید:`,

        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✏️ ویرایش",

                  callback_data: `country_edit:${country.id}`,
                },
              ],

              [
                {
                  text: "🖥 مدیریت سرورها",

                  callback_data: `country_servers:${country.id}`,
                },
              ],

              [
                {
                  text: "❌ حذف",

                  callback_data: `country_delete:${country.id}`,
                },
              ],
            ],
          },
        },
      );
    }

    case "country_delete": {

    await countryService.deleteCountry(Number(id));

    await ctx.answerCbQuery("✅ کشور حذف شد");

    const countries = await countryService.getCountries();

    if (!countries.length) {

        return ctx.editMessageText("❌ هیچ کشوری وجود ندارد.");

    }

    return ctx.editMessageText(

        "🌍 کشورهای ثبت شده:",

        countryListKeyboard(countries)

    );

}
  }
};

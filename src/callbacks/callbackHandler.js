const ACTION = require("../constants/callbackActions");

const serverService = require("../services/serverService");
const planService = require("../services/planService");
const countryService = require("../services/countryService");

const countryListKeyboard = require("../keyboards/countryListKeyboard");

module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;

  const [action, id] = data.split(":");

  await ctx.answerCbQuery();

  switch (action) {
    // ==========================
    // USER
    // ==========================

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

    // ==========================
    // ADMIN COUNTRY
    // ==========================

    case "admin_country": {
      const country = await countryService.getCountry(Number(id));

      return ctx.editMessageText(
        `🌍 ${country.flag} ${country.name}

کد کشور: ${country.code}

یکی از گزینه‌ها را انتخاب کنید:`,

        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✏️ ویرایش",
                  callback_data: `admin_country_edit:${country.id}`,
                },
              ],

              [
                {
                  text: "🖥 مدیریت سرورها",
                  callback_data: `admin_country_servers:${country.id}`,
                },
              ],

              [
                {
                  text: "❌ حذف",
                  callback_data: `admin_country_delete:${country.id}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",
                  callback_data: "admin_country_list",
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_country_delete": {
      await countryService.deleteCountry(Number(id));

      const countries = await countryService.getCountries();

      if (!countries.length) {
        return ctx.editMessageText("❌ هیچ کشوری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🌍 کشورهای ثبت شده:",

        countryListKeyboard(countries),
      );
    }

    case "admin_country_list": {
      const countries = await countryService.getCountries();

      if (!countries.length) {
        return ctx.editMessageText("❌ هیچ کشوری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🌍 کشورهای ثبت شده:",

        countryListKeyboard(countries),
      );
    }

    case "admin_country_back": {
      return ctx.deleteMessage().then(() => {
        return ctx.reply(
          "🌍 مدیریت کشورها",
          require("../keyboards/countryAdminKeyboard"),
        );
      });
    }
  }
};

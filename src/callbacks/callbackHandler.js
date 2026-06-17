const ACTION = require("../constants/callbackActions");

const serverService = require("../services/serverService");
const planService = require("../services/planService");
const countryService = require("../services/countryService");

const countryListKeyboard = require("../keyboards/countryListKeyboard");
const serverListKeyboard = require("../keyboards/serverListKeyboard");

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

    case "admin_server_country": {
      const session = await require("../sessions/sessionManager").get(
        ctx.from.id,
      );

      await require("../sessions/sessionManager").next(
        ctx.from.id,

        "INBOUND",

        {
          ...session.data,

          countryId: Number(id),
        },
      );

      return ctx.editMessageText("🔌 Inbound ID را وارد کنید.");
    }

    case "admin_server": {
      const server = await serverService.getServer(Number(id));

      return ctx.editMessageText(
        `🖥 ${server.name}

🌍 کشور: ${server.country.flag} ${server.country.name}

🔌 Inbound ID: ${server.inboundId}

📝 Remark: ${server.remark ?? "-"}

یکی از گزینه‌ها را انتخاب کنید:`,

        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✏️ ویرایش",
                  callback_data: `admin_server_edit:${server.id}`,
                },
              ],

              [
                {
                  text: "📦 مدیریت پلن‌ها",
                  callback_data: `admin_server_plans:${server.id}`,
                },
              ],

              [
                {
                  text: "❌ حذف",
                  callback_data: `admin_server_delete:${server.id}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",
                  callback_data: "admin_server_list",
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_server_delete": {
      await serverService.deleteServer(Number(id));

      const servers = await serverService.getServersList();

      if (!servers.length) {
        return ctx.editMessageText("❌ هنوز سروری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🖥 سرورهای ثبت شده:",

        serverListKeyboard(servers),
      );
    }

    case "admin_server_list": {
      const servers = await serverService.getServers();

      if (!servers.length) {
        return ctx.editMessageText("❌ هنوز سروری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🖥 سرورهای ثبت شده:",
        serverListKeyboard(servers),
      );
    }

    case "admin_server_back": {
      return ctx.deleteMessage().then(() => {
        return ctx.reply(
          "🖥 مدیریت سرورها",

          require("../keyboards/serverAdminKeyboard"),
        );
      });
    }
  }
};

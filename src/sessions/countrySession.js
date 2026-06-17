const sessionManager = require("./sessionManager");

const countryService = require("../services/countryService");

const countryAdminKeyboard = require("../keyboards/countryAdminKeyboard");

const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = async (ctx, session) => {
  const text = ctx.message.text.trim();

  if (text === "❌ لغو") {
    await sessionManager.clear(ctx.from.id);

    return ctx.reply(
      "❌ عملیات لغو شد.",

      countryAdminKeyboard,
    );
  }

  switch (session.step) {
    case SESSION_STEPS.NAME: {
      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.CODE,

        {
          name: text,
        },
      );

      return ctx.reply("🇺🇳 کد کشور را وارد کنید.");
    }

    case SESSION_STEPS.CODE: {
      const exists = await countryService.countryExists(text.toUpperCase());

      if (exists) {
        return ctx.reply("❌ این کد قبلاً ثبت شده است.");
      }

      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.FLAG,

        {
          ...session.data,

          code: text.toUpperCase(),
        },
      );

      return ctx.reply("🏳️ ایموجی پرچم را ارسال کنید.");
    }

    case SESSION_STEPS.FLAG: {
      await countryService.createCountry({
        name: session.data.name,

        code: session.data.code,

        flag: text,
      });

      await sessionManager.clear(ctx.from.id);

      return ctx.reply(
        "✅ کشور با موفقیت ثبت شد.",

        countryAdminKeyboard,
      );
    }
  }
};

const sessionManager = require("./sessionManager");
const serverService = require("../services/serverService");
const SESSION_STEPS = require("../constants/sessionSteps");

const countryService = require("../services/countryService");
const serverCountryKeyboard = require("../keyboards/serverCountryKeyboard");

module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  console.log("SERVER STEP:", session.step);
  console.log("TEXT:", text);

  switch (session.step) {
    case SESSION_STEPS.NAME: {
      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.COUNTRY,

        {
          name: text,
        },
      );

      const countries = await countryService.getCountries();

      return ctx.reply(
        "🌍 کشور سرور را انتخاب کنید.",

        serverCountryKeyboard(countries),
      );
    }

    case SESSION_STEPS.COUNTRY: {
      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.INBOUND,

        {
          ...session.data,

          countryId: Number(text),
        },
      );

      return ctx.reply("🔌 Inbound ID را وارد کنید.");
    }

    case SESSION_STEPS.INBOUND: {
      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.REMARK,

        {
          ...session.data,

          inboundId: Number(text),
        },
      );

      return ctx.reply("📝 Remark را وارد کنید.\n\nاگر ندارید '-' ارسال کنید.");
    }

    case SESSION_STEPS.REMARK: {
      await serverService.createServer({
        name: session.data.name,

        countryId: session.data.countryId,

        inboundId: session.data.inboundId,

        remark: text === "-" ? null : text,
      });

      await sessionManager.clear(ctx.from.id);

      return ctx.reply("✅ سرور با موفقیت ثبت شد.");
    }
  }
};

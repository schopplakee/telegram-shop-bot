const sessionManager = require("./sessionManager");
const countryService = require("../services/countryService");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  if (
    text === "❌ لغو" ||
    text === "⬅️ بازگشت" ||
    text === "/admin" ||
    text === "🌍 مدیریت کشورها"
  ) {
    await sessionManager.clear(ctx.from.id);

    return ctx.reply("❌ عملیات لغو شد.");
  }

  switch (session.step) {
    case SESSION_STEPS.NAME: {
      await sessionManager.next(ctx.from.id, SESSION_STEPS.CODE, {
        name: text,
      });

      return ctx.reply("🇺🇳 کد کشور را وارد کنید (مثال: DE)");
    }

    case SESSION_STEPS.CODE: {
      const exists = await countryService.countryExists(text.toUpperCase());

      if (exists) {
        return ctx.reply("❌ این کد قبلاً ثبت شده");
      }

      await sessionManager.next(ctx.from.id, SESSION_STEPS.FLAG, {
        ...session.data,
        code: text.toUpperCase(),
      });

      return ctx.reply("🏳️ ایموجی پرچم را ارسال کنید");
    }

    case SESSION_STEPS.FLAG: {
      await countryService.createCountry({
        name: session.data.name,
        code: session.data.code,
        flag: text,
      });

      await sessionManager.clear(ctx.from.id);

      return ctx.reply("✅ کشور با موفقیت ثبت شد");
    }
  }
};

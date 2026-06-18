const sessionManager = require("./sessionManager");
const planService = require("../services/planService");
const SESSION_STEPS = require("../constants/sessionSteps");
const planAdminKeyboard = require("../keyboards/planAdminKeyboard");


module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  switch (session.step) {
    case SESSION_STEPS.EDIT_NAME: {
      await sessionManager.next(
        ctx.from.id,

        "EDIT_DAYS",

        {
          ...session.data,

          name: text,
        },
      );

      return ctx.reply("📅 تعداد روز را وارد کنید.");
    }

    case "EDIT_DAYS": {
      await sessionManager.next(
        ctx.from.id,

        "EDIT_TRAFFIC",

        {
          ...session.data,

          days: Number(text),
        },
      );

      return ctx.reply("🌐 حجم را وارد کنید.");
    }

    case "EDIT_TRAFFIC": {
      await sessionManager.next(
        ctx.from.id,

        "EDIT_PRICE",

        {
          ...session.data,

          traffic: Number(text),
        },
      );

      return ctx.reply("💰 قیمت را وارد کنید.");
    }

    case "EDIT_PRICE": {
      await planService.updatePlan(
        session.data.planId,

        {
          name: session.data.name,

          days: session.data.days,

          traffic: session.data.traffic,

          price: Number(text),
        },
      );

      await sessionManager.clear(ctx.from.id);

      return ctx.reply(
        "✅ پلن با موفقیت ویرایش شد.",

        planAdminKeyboard,
      );
    }
  }
};

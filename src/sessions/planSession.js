const sessionManager = require("./sessionManager");
const SESSION_STEPS = require("../constants/sessionSteps");

const planService = require("../services/planService");

const planAdminKeyboard = require("../keyboards/planAdminKeyboard");

module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  switch (session.step) {
    case SESSION_STEPS.NAME: {
      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.DAYS,

        {
          ...session.data,

          name: text,
        },
      );

      return ctx.reply("📅 تعداد روز را وارد کنید.");
    }

    case SESSION_STEPS.DAYS: {
      const days = Number(text);

      if (isNaN(days) || days <= 0) {
        return ctx.reply("❌ تعداد روز معتبر نیست.");
      }

      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.TRAFFIC,

        {
          ...session.data,

          days,
        },
      );

      return ctx.reply("🌐 حجم (GB) را وارد کنید.");
    }

    case SESSION_STEPS.TRAFFIC: {
      const traffic = Number(text);

      if (isNaN(traffic) || traffic <= 0) {
        return ctx.reply("❌ حجم معتبر نیست.");
      }

      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.PRICE,

        {
          ...session.data,

          traffic,
        },
      );

      return ctx.reply("💰 قیمت را وارد کنید.");
    }

    case SESSION_STEPS.PRICE: {
      const price = Number(text);

      if (isNaN(price) || price < 0) {
        return ctx.reply("❌ قیمت معتبر نیست.");
      }

      await planService.createPlan({
        serverId: session.data.serverId,
        name: session.data.name,
        days: session.data.days,
        traffic: session.data.traffic,
        price,
      });

      await sessionManager.clear(ctx.from.id);

      return ctx.reply(
        "✅ پلن با موفقیت ثبت شد.",
        planAdminKeyboard,
      );
    }
  }
};

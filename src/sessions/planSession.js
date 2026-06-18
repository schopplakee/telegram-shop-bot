const sessionManager = require("./sessionManager");
const planService = require("../services/planService");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  switch (session.step) {
    case SESSION_STEPS.NAME:
      await sessionManager.next(
        ctx.from.id,

        "DAYS",

        {
          ...session.data,

          name: text,
        },
      );

      return ctx.reply("📅 تعداد روز را وارد کنید.");

    case "DAYS":
      await sessionManager.next(
        ctx.from.id,

        "TRAFFIC",

        {
          ...session.data,

          days: Number(text),
        },
      );

      return ctx.reply("🌐 حجم (GB) را وارد کنید.");

    case "TRAFFIC":
      await sessionManager.next(
        ctx.from.id,

        "PRICE",

        {
          ...session.data,

          traffic: Number(text),
        },
      );

      return ctx.reply("💰 قیمت را وارد کنید.");

    case "PRICE":
      await planService.createPlan({
        serverId: session.data.serverId,

        name: session.data.name,

        days: session.data.days,

        traffic: session.data.traffic,

        price: Number(text),
      });

      await sessionManager.clear(ctx.from.id);

      return ctx.reply("✅ پلن با موفقیت ثبت شد.");
  }
};

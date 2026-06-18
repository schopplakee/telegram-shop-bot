const sessionManager = require("./sessionManager");
const planService = require("../services/planService");

module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  switch (session.step) {
    case "EDIT_NAME":
      await sessionManager.next(
        ctx.from.id,

        "EDIT_DAYS",

        {
          ...session.data,

          name: text === "-" ? session.data.old.name : text,
        },
      );

      return ctx.reply(
        "📅 تعداد روز جدید را وارد کنید.\n\nبرای عدم تغییر '-' ارسال کنید.",
      );

    case "EDIT_DAYS":
      await sessionManager.next(
        ctx.from.id,

        "EDIT_TRAFFIC",

        {
          ...session.data,

          days: text === "-" ? session.data.old.days : Number(text),
        },
      );

      return ctx.reply(
        "🌐 حجم جدید را وارد کنید.\n\nبرای عدم تغییر '-' ارسال کنید.",
      );

    case "EDIT_TRAFFIC":
      await sessionManager.next(
        ctx.from.id,

        "EDIT_PRICE",

        {
          ...session.data,

          traffic: text === "-" ? session.data.old.traffic : Number(text),
        },
      );

      return ctx.reply(
        "💰 قیمت جدید را وارد کنید.\n\nبرای عدم تغییر '-' ارسال کنید.",
      );

    case "EDIT_PRICE":
      await planService.updatePlan(
        session.data.planId,

        {
          name: session.data.name,

          days: session.data.days,

          traffic: session.data.traffic,

          price: text === "-" ? session.data.old.price : Number(text),
        },
      );

      await sessionManager.clear(ctx.from.id);

      return ctx.reply("✅ پلن با موفقیت ویرایش شد.");
  }
};

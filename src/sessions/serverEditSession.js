const sessionManager = require("./sessionManager");
const serverService = require("../services/serverService");
const SESSION_STEPS = require("../constants/sessionSteps");
const serverAdminKeyboard = require("../keyboards/serverAdminKeyboard");

module.exports = async (ctx, session) => {
  const text = ctx.message.text;

  switch (session.step) {
    case SESSION_STEPS.EDIT_NAME: {
      await sessionManager.next(
        ctx.from.id,

        SESSION_STEPS.EDIT_REMARK,

        {
          ...session.data,

          name: text,
        },
      );

      return ctx.reply(
        "📝 Remark جدید را وارد کنید.\n\nاگر نمی‌خواهید تغییر کند، '-' ارسال کنید.",
      );
    }

    case SESSION_STEPS.EDIT_REMARK: {
      await serverService.updateServer(
        session.data.serverId,

        {
          name: session.data.name,

          remark: text === "-" ? null : text,
        },
      );

      await sessionManager.clear(ctx.from.id);

      return ctx.reply(
        "✅ سرور با موفقیت ویرایش شد.",

        serverAdminKeyboard,
      );
    }
  }
};

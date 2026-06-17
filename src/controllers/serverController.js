const sessionManager = require("../sessions/sessionManager");

const serverService = require("../services/serverService");

const serverListKeyboard = require("../keyboards/serverListKeyboard");
const serverAdminKeyboard = require("../keyboards/serverAdminKeyboard");

const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = {
  async addServer(ctx) {
    await sessionManager.start(
      ctx.from.id,

      SESSION_MODULES.SERVER,
      SESSION_STEPS.NAME,
      {},
    );

    return ctx.reply(
      "🖥 نام سرور را وارد کنید.",

      {
        reply_markup: {
          keyboard: [["❌ لغو"]],
          resize_keyboard: true,
        },
      },
    );
  },

  async listServers(ctx) {
    const servers = await serverService.getServers();

    if (!servers.length) {
      return ctx.reply(
        "❌ هنوز سروری ثبت نشده است.",
        serverAdminKeyboard,
      );
    }

    return ctx.reply(
      "🖥 سرورهای ثبت شده:",
      serverListKeyboard(servers),
    );
  },

  async cancel(ctx) {
    await sessionManager.clear(ctx.from.id);
    return ctx.reply(
      "🖥 مدیریت سرورها",
      serverAdminKeyboard,
    );
  },
};

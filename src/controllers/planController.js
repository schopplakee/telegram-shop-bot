const sessionManager = require("../sessions/sessionManager");

const planService = require("../services/planService");
const serverService = require("../services/serverService");

const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

const cancelKeyboard = require("../keyboards/cancelKeyboard");
const planAdminKeyboard = require("../keyboards/planAdminKeyboard");
const planListKeyboard = require("../keyboards/planListKeyboard");
const serverListKeyboard = require("../keyboards/serverListKeyboard");

module.exports = {
  async addPlan(ctx, serverId = null) {
    if (!serverId) {
      const servers = await serverService.getServers();

      return ctx.reply(
        "🖥 ابتدا سرور را انتخاب کنید.",

        require("../keyboards/serverSelectKeyboard")(servers),
      );
    }

    await sessionManager.start(
      ctx.from.id,

      "PLAN",

      SESSION_STEPS.NAME,

      {
        serverId,
      },
    );

    return ctx.reply(
      "📝 نام پلن را وارد کنید.",

      cancelKeyboard,
    );
  },

  async listPlans(ctx, serverId) {
    const plans = await planService.getPlans(serverId);

    if (!plans.length) {
      return ctx.reply("❌ هنوز پلنی ثبت نشده است.");
    }

    return ctx.reply(
      "📦 پلن‌های ثبت شده:",

      planListKeyboard(plans),
    );
  },

  async cancel(ctx) {
    await sessionManager.clear(ctx.from.id);

    return ctx.reply("📦 مدیریت پلن‌ها", planAdminKeyboard);
  },
};

const sessionManager = require("../sessions/sessionManager");
const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

const cancelKeyboard = require("../keyboards/cancelKeyboard");
const planAdminKeyboard = require("../keyboards/planAdminKeyboard");

const planService = require("../services/planService");
const planListKeyboard = require("../keyboards/planListKeyboard");

module.exports = {
  async addPlan(ctx) {
    const serverId = Number(ctx.match[1]);

    await sessionManager.start(
      ctx.from.id,

      SESSION_MODULES.PLAN,

      SESSION_STEPS.NAME,

      { serverId },
    );

    return ctx.reply(
      "📦 نام پلن را وارد کنید.",
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

    return ctx.reply(
      "📦 مدیریت پلن‌ها",
      planAdminKeyboard,
    );
  },
};

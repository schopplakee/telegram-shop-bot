const ACTION = require("../constants/callbackActions");

const serverService = require("../services/serverService");
const planService = require("../services/planService");

const { serverKeyboard } = require("../keyboards/serverKeyboard");
const { planKeyboard } = require("../keyboards/planKeyboard");

module.exports = async (ctx) => {

  const data = ctx.callbackQuery.data;

  const [action, id] = data.split(":");

  await ctx.answerCbQuery();

  switch (action) {

    case ACTION.COUNTRY: {

      const servers = await serverService.getServers(Number(id));

      return ctx.editMessageText(

        "🖥 سرور موردنظر را انتخاب کنید:",

        serverKeyboard(servers)

      );

    }

    case ACTION.SERVER: {

      const plans = await planService.getPlans(Number(id));

      return ctx.editMessageText(

        "📦 پلن موردنظر را انتخاب کنید:",

        planKeyboard(plans)

      );

    }

    case ACTION.PLAN: {

      return ctx.editMessageText(

        `✅ پلن شماره ${id} انتخاب شد.\n\nمرحله بعد: انتخاب روش پرداخت`

      );

    }

  }

};
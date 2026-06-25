const ACTION = require("../constants/callbackActions");

const serverService = require("../services/serverService");
const planService = require("../services/planService");
const countryService = require("../services/countryService");

const countryListKeyboard = require("../keyboards/countryListKeyboard");
const serverListKeyboard = require("../keyboards/serverListKeyboard");
const planListKeyboard = require("../keyboards/planListKeyboard");
const planAdminKeyboard = require("../keyboards/planAdminKeyboard");
const paymentKeyboard = require("../keyboards/paymentKeyboard");

const { serverKeyboard } = require("../keyboards/serverKeyboard");
const { planKeyboard } = require("../keyboards/planKeyboard");

const planController = require("../controllers/planController");
const paymentController = require("../controllers/paymentController");
const sessionManager = require("../sessions/sessionManager");
const serviceController = require("../controllers/serviceController");

module.exports = async (ctx) => {
  const data = ctx.callbackQuery.data;

  console.log(data);

  const [action, id] = data.split(":");

  await ctx.answerCbQuery();

  if (data.startsWith("service:")) {
    return serviceController.show(ctx, data.split(":")[1]);
  }

  if (data.startsWith("service_refresh:")) {
    return serviceController.refresh(ctx, data.split(":")[1]);
  }

  if (data.startsWith("service_link:")) {
    return serviceController.subscription(ctx, data.split(":")[1]);
  }

  if (data.startsWith("service_qr:")) {
    return serviceController.qr(ctx, data.split(":")[1]);
  }

  if (data.startsWith("service_configs:")) {
    return serviceController.configs(ctx, data.split(":")[1]);
  }

  if (data.startsWith("service_toggle:")) {
    return serviceController.toggle(ctx, Number(data.split(":")[1]));
  }

  if (data.startsWith("service_delete:")) {
    return serviceController.remove(ctx, Number(data.split(":")[1]));
  }

  if (data.startsWith("confirm_delete:")) {
    return serviceController.confirmDelete(ctx, Number(data.split(":")[1]));
  }

  if (data.startsWith("service_newsub:")) {
    return serviceController.newSubscription(ctx, Number(data.split(":")[1]));
  }

  if (data.startsWith("service_renew:")) {
    return serviceController.renew(ctx, Number(data.split(":")[1]));
  }

  if (data.startsWith("wallet_renew:")) {
    return paymentController.walletRenew(ctx, Number(data.split(":")[1]));
  }

  if (data.startsWith("renew_card:")) {
    return paymentController.cardRenew(ctx, Number(data.split(":")[1]));
  }

  switch (action) {
    // ==========================
    // USER
    // ==========================

    case ACTION.COUNTRY: {
      const servers = await serverService.getServers(Number(id));

      return ctx.editMessageText(
        "🖥 سرور موردنظر را انتخاب کنید:",

        serverKeyboard(servers),
      );
    }

    case ACTION.SERVER: {
      const plans = await planService.getPlans(Number(id));

      return ctx.editMessageText(
        "📦 پلن موردنظر را انتخاب کنید:",

        planKeyboard(plans),
      );
    }

    case ACTION.PLAN: {
      const plan = await planService.getPlan(Number(id));

      await sessionManager.start(
        ctx.from.id,

        "PURCHASE",

        "PAYMENT",

        {
          planId: plan.id,

          serverId: plan.serverId,

          countryId: plan.server.countryId,

          inboundId: plan.server.inboundId,
        },
      );

      return ctx.editMessageText(
        `✅ پلن ${plan.name} انتخاب شد.

💳 روش پرداخت را انتخاب کنید.`,

        paymentKeyboard,
      );
    }

    // Payment

    case "payment_gateway":
      return paymentController.gateway(ctx);

    case "payment_card":
      return paymentController.card(ctx);

    case "payment_wallet":
      return paymentController.wallet(ctx);

    // ==========================
    // ADMIN COUNTRY
    // ==========================

    case "admin_country": {
      const country = await countryService.getCountry(Number(id));

      return ctx.editMessageText(
        `🌍 ${country.flag} ${country.name}

کد کشور: ${country.code}

یکی از گزینه‌ها را انتخاب کنید:`,

        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✏️ ویرایش",
                  callback_data: `admin_country_edit:${country.id}`,
                },
              ],

              [
                {
                  text: "🖥 مدیریت سرورها",
                  callback_data: `admin_country_servers:${country.id}`,
                },
              ],

              [
                {
                  text: "❌ حذف",
                  callback_data: `admin_country_delete:${country.id}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",
                  callback_data: "admin_country_list",
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_country_delete": {
      await countryService.deleteCountry(Number(id));

      const countries = await countryService.getCountries();

      if (!countries.length) {
        return ctx.editMessageText("❌ هیچ کشوری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🌍 کشورهای ثبت شده:",

        countryListKeyboard(countries),
      );
    }

    case "admin_country_list": {
      const countries = await countryService.getCountries();

      if (!countries.length) {
        return ctx.editMessageText("❌ هیچ کشوری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🌍 کشورهای ثبت شده:",

        countryListKeyboard(countries),
      );
    }

    case "admin_country_back": {
      return ctx.deleteMessage().then(() => {
        return ctx.reply(
          "🌍 مدیریت کشورها",
          require("../keyboards/countryAdminKeyboard"),
        );
      });
    }

    case "admin_server_country": {
      const session = await require("../sessions/sessionManager").get(
        ctx.from.id,
      );

      await require("../sessions/sessionManager").next(
        ctx.from.id,

        "INBOUND",

        {
          ...session.data,

          countryId: Number(id),
        },
      );

      return ctx.editMessageText("🔌 Inbound ID را وارد کنید.");
    }

    case "admin_server": {
      const server = await serverService.getServer(Number(id));

      console.log(server.id);

      return ctx.editMessageText(
        `🖥 ${server.name}

🌍 کشور: ${server.country.flag} ${server.country.name}

🔌 Inbound ID: ${server.inboundId}

📝 Remark: ${server.remark ?? "-"}

یکی از گزینه‌ها را انتخاب کنید:`,

        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✏️ ویرایش",
                  callback_data: `admin_server_edit:${server.id}`,
                },
              ],

              [
                {
                  text: "📦 مدیریت پلن‌ها",
                  callback_data: `admin_server_plans:${server.id}`,
                },
              ],

              [
                {
                  text: "❌ حذف",
                  callback_data: `admin_server_delete:${server.id}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",
                  callback_data: "admin_server_list",
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_server_delete": {
      await serverService.deleteServer(Number(id));

      const servers = await serverService.getServers();

      if (!servers.length) {
        return ctx.editMessageText("❌ هنوز سروری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🖥 سرورهای ثبت شده:",

        serverListKeyboard(servers),
      );
    }

    case "admin_server_list": {
      const servers = await serverService.getServers();

      if (!servers.length) {
        return ctx.editMessageText("❌ هنوز سروری ثبت نشده است.");
      }

      return ctx.editMessageText(
        "🖥 سرورهای ثبت شده:",
        serverListKeyboard(servers),
      );
    }

    case "admin_server_back": {
      return ctx.deleteMessage().then(() => {
        return ctx.reply(
          "🖥 مدیریت سرورها",

          require("../keyboards/serverAdminKeyboard"),
        );
      });
    }

    case "admin_server_edit": {
      const server = await serverService.getServer(Number(id));

      const sessionManager = require("../sessions/sessionManager");

      await sessionManager.start(
        ctx.from.id,

        "SERVER_EDIT",

        "EDIT_NAME",

        {
          serverId: server.id,
        },
      );

      await ctx.deleteMessage();

      return ctx.reply(
        "✏️ نام جدید سرور را وارد کنید.",
        require("../keyboards/cancelKeyboard"),
      );
    }

    case "admin_server_plans": {
      const plans = await planService.getPlans(Number(id));

      return ctx.editMessageText(
        "📦 مدیریت پلن‌ها",

        {
          reply_markup: {
            inline_keyboard: [
              ...plans.map((plan) => [
                {
                  text: `${plan.name} | ${plan.days} روز | ${plan.traffic}GB`,

                  callback_data: `admin_plan:${plan.id}`,
                },
              ]),

              [
                {
                  text: "➕ افزودن پلن",

                  callback_data: `admin_plan_add:${id}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",

                  callback_data: `admin_server:${id}`,
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_plan_add": {
      return planController.addPlan(ctx, Number(id));
    }

    case "admin_plan": {
      const plan = await planService.getPlan(Number(id));

      return ctx.editMessageText(
        `📦 ${plan.name}

📅 ${plan.days} روز

🌐 ${plan.traffic} GB

💰 ${plan.price.toLocaleString()} تومان`,

        {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "✏️ ویرایش",

                  callback_data: `admin_plan_edit:${plan.id}`,
                },
              ],

              [
                {
                  text: "❌ حذف",

                  callback_data: `admin_plan_delete:${plan.id}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",

                  callback_data: `admin_plan_back:${plan.id}`,
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_plan_delete": {
      const plan = await planService.getPlan(Number(id));

      await planService.deletePlan(plan.id);

      const plans = await planService.getPlans(plan.serverId);

      return ctx.editMessageText(
        "📦 مدیریت پلن‌ها",

        {
          reply_markup: {
            inline_keyboard: [
              ...plans.map((item) => [
                {
                  text: `${item.name} | ${item.days} روز | ${item.traffic}GB`,

                  callback_data: `admin_plan:${item.id}`,
                },
              ]),

              [
                {
                  text: "➕ افزودن پلن",

                  callback_data: `admin_plan_add:${plan.serverId}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",

                  callback_data: `admin_server:${plan.serverId}`,
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_plan_back": {
      const plan = await planService.getPlan(Number(id));

      const plans = await planService.getPlans(plan.serverId);

      return ctx.editMessageText(
        "📦 مدیریت پلن‌ها",

        {
          reply_markup: {
            inline_keyboard: [
              ...plans.map((plan) => [
                {
                  text: `${plan.name} | ${plan.days} روز | ${plan.traffic}GB`,

                  callback_data: `admin_plan:${plan.id}`,
                },
              ]),

              [
                {
                  text: "➕ افزودن پلن",

                  callback_data: `admin_plan_add:${plan.serverId}`,
                },
              ],

              [
                {
                  text: "⬅️ بازگشت",

                  callback_data: `admin_server:${plan.serverId}`,
                },
              ],
            ],
          },
        },
      );
    }

    case "admin_plan_edit": {
      const plan = await planService.getPlan(Number(id));

      const sessionManager = require("../sessions/sessionManager");

      await sessionManager.start(
        ctx.from.id,

        "PLAN_EDIT",

        "EDIT_NAME",

        {
          planId: plan.id,
        },
      );

      await ctx.deleteMessage();

      return ctx.reply(
        "✏️ نام جدید پلن را وارد کنید.",

        require("../keyboards/cancelKeyboard"),
      );
    }

    case "plan_add": {
      return planController.addPlan(
        ctx,

        Number(id),
      );
    }

    case "plan_select_server": {
      return planController.addPlan(
        ctx,

        Number(id),
      );
    }
  }
};

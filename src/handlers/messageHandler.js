const menuController = require("../controllers/menuController");
const adminController = require("../controllers/adminController");
const countryController = require("../controllers/countryController");
const serverController = require("../controllers/serverController");
const planController = require("../controllers/planController");

const MENU = require("../constants/menu");
const ADMIN = require("../constants/adminMenu");

const sessionManager = require("../sessions/sessionManager");
const countrySession = require("../sessions/countrySession");
const serverSession = require("../sessions/serverSession");
const planSession = require("../sessions/planSession");

const serverEditSession = require("../sessions/serverEditSession");
const planEditSession = require("../sessions/planEditSession");

const routes = {
  // User
  [MENU.BUY_SERVICE]: menuController.buyService,
  [MENU.WALLET]: menuController.wallet,
  [MENU.MY_SERVICES]: menuController.myServices,
  [MENU.GUIDE]: menuController.guide,
  [MENU.REFERRAL]: menuController.referral,
  [MENU.SUPPORT]: menuController.support,

  // Admin
  [ADMIN.COUNTRIES]: adminController.countries,
  [ADMIN.SERVERS]: adminController.servers,
  [ADMIN.PLANS]: adminController.plans,
  [ADMIN.USERS]: adminController.users,
  [ADMIN.TRANSACTIONS]: adminController.transactions,
  [ADMIN.DISCOUNTS]: adminController.discounts,
  [ADMIN.SETTINGS]: adminController.settings,
  [ADMIN.STATS]: adminController.stats,
  [ADMIN.BROADCAST]: adminController.broadcast,

  // Country
  ["➕ افزودن کشور"]: countryController.addCountry,
  ["📋 لیست کشورها"]: countryController.listCountries,

  // Server
  ["➕ افزودن سرور"]: serverController.addServer,
  ["📋 لیست سرورها"]: serverController.listServers,

  // Plan
  ["➕ افزودن پلن"]: planController.addPlan,
  ["📋 لیست پلن‌ها"]: planController.listPlans,

  ["⬅️ بازگشت"]: adminController.back,
};

module.exports = async (ctx) => {
  const text = ctx.message?.text;

  if (text === "❌ لغو") {
    const session = await sessionManager.get(ctx.from.id);

    if (!session) return;

    switch (session.module) {
      case "COUNTRY":
        return countryController.cancel(ctx);

      case "SERVER":
        return serverController.cancel(ctx);

      case "SERVER_EDIT":
        return serverController.cancel(ctx);

      case "PLAN":
        return planController.cancel(ctx);

      case "PLAN_EDIT":
        return planController.cancel(ctx);
    }
  }

  const session = await sessionManager.get(ctx.from.id);

  if (session && routes[text]) {
    await sessionManager.clear(ctx.from.id);
  }

  // 1- اگر Route وجود داشت، مستقیم اجرا شود
  const handler = routes[text];

  if (handler) {
    return handler(ctx);
  }

  const currentSession = await sessionManager.get(ctx.from.id);

  if (!currentSession) {
    return;
  }

  switch (currentSession.module) {
    case "COUNTRY":
      return countrySession(ctx, currentSession);

    case "SERVER":
      return serverSession(ctx, currentSession);

    case "SERVER_EDIT":
      return serverEditSession(ctx, currentSession);

    case "PLAN":
      return planSession(ctx, currentSession);

    case "PLAN_EDIT":
      return planEditSession(ctx, currentSession);
  }
};

const sessionManager = require("../sessions/sessionManager");
const countrySession = require("../sessions/countrySession");

const menuController = require("../controllers/menuController");

const MENU = require("../constants/menu");

const adminController = require("../controllers/adminController");
const ADMIN = require("../constants/adminMenu");
const countryController = require("../controllers/countryController");

const routes = {
  [MENU.BUY_SERVICE]: menuController.buyService,
  [MENU.WALLET]: menuController.wallet,
  [MENU.MY_SERVICES]: menuController.myServices,
  [MENU.GUIDE]: menuController.guide,
  [MENU.REFERRAL]: menuController.referral,
  [MENU.SUPPORT]: menuController.support,

  [ADMIN.COUNTRIES]: adminController.countries,
  [ADMIN.SERVERS]: adminController.servers,
  [ADMIN.PLANS]: adminController.plans,
  [ADMIN.USERS]: adminController.users,

  [ADMIN.TRANSACTIONS]: adminController.transactions,
  [ADMIN.DISCOUNTS]: adminController.discounts,

  [ADMIN.SETTINGS]: adminController.settings,
  [ADMIN.STATS]: adminController.stats,
  [ADMIN.BROADCAST]: adminController.broadcast,

  ["➕ افزودن کشور"]: countryController.addCountry,
  ["📋 لیست کشورها"]: countryController.listCountries,
};

module.exports = async (ctx) => {
  const text = ctx.message?.text;
  
  console.log("USER TEXT:", text);

  const session = await sessionManager.get(ctx.from.id);

  if (session) {
    if (session.module === "COUNTRY") {
      return countrySession(ctx, session);
    }
  }

  const handler = routes[text];

  if (handler) {
    return handler(ctx);
  }

};

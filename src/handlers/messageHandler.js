const menuController = require("../controllers/menuController");
const adminController = require("../controllers/adminController");
const countryController = require("../controllers/countryController");

const MENU = require("../constants/menu");
const ADMIN = require("../constants/adminMenu");

const sessionManager = require("../sessions/sessionManager");
const countrySession = require("../sessions/countrySession");

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

};

module.exports = async (ctx) => {

    const text = ctx.message?.text;

    // 1- اگر Route وجود داشت، مستقیم اجرا شود
    const handler = routes[text];

    if (handler) {
        return handler(ctx);
    }

    // 2- اگر Route نبود، Session بررسی شود
    const session = await sessionManager.get(ctx.from.id);

    if (!session) {
        return;
    }

    switch (session.module) {

        case "COUNTRY":
            return countrySession(ctx, session);

    }

};
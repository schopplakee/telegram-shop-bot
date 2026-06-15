const menuController = require("../controllers/menuController");

const MENU = require("../constants/menu");

const routes = {
  [MENU.BUY_SERVICE]: menuController.buyService,
  [MENU.WALLET]: menuController.wallet,
  [MENU.MY_SERVICES]: menuController.myServices,
  [MENU.GUIDE]: menuController.guide,
  [MENU.REFERRAL]: menuController.referral,
  [MENU.SUPPORT]: menuController.support,
};

module.exports = async (ctx) => {
  const text = ctx.message?.text;

  const handler = routes[text];

  if (handler) {
    return handler(ctx);
  }
};
const { Markup } = require("telegraf");

const MENU = require("../constants/menu");

const mainKeyboard = Markup.keyboard([
  [MENU.BUY_SERVICE],
  [MENU.WALLET, MENU.MY_SERVICES],
  [MENU.GUIDE, MENU.REFERRAL],
  [MENU.SUPPORT]
]).resize();

module.exports = mainKeyboard;
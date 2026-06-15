const { Markup } = require("telegraf");
const ACTION = require("../constants/callbackActions");

const countries = [
  { id: 1, name: "🇩🇪 آلمان" },
  { id: 2, name: "🇫🇮 فنلاند" },
  { id: 3, name: "🇹🇷 ترکیه" },
  { id: 4, name: "🇳🇱 هلند" },
];

function countryKeyboard() {
  return Markup.inlineKeyboard(
    countries.map(country => [
      Markup.button.callback(
        country.name,
        `${ACTION.COUNTRY}:${country.id}`
      )
    ])
  );
}

module.exports = {
  countryKeyboard,
};
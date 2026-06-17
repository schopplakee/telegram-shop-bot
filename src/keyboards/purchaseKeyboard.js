const { Markup } = require("telegraf");
const ACTION = require("../constants/callbackActions");

function countryKeyboard(countries) {
  return Markup.inlineKeyboard(
    countries.map((country) => [
      Markup.button.callback(
        country.name,

        `${ACTION.COUNTRY}:${country.id}`,
      ),
    ]),
  );
}

module.exports = {
  countryKeyboard,
};

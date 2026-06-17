const { Markup } = require("telegraf");

module.exports = (countries) => {
  const buttons = countries.map((country) => [
    Markup.button.callback(
      `${country.flag} ${country.name}`,

      `admin_country:${country.id}`,
    ),
  ]);

  buttons.push([
    Markup.button.callback(
      "⬅️ بازگشت",

      "admin_country_back",
    ),
  ]);

  return Markup.inlineKeyboard(buttons);
};

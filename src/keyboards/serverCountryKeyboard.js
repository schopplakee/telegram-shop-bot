const { Markup } = require("telegraf");

module.exports = (countries) => {
  const buttons = countries.map((country) => [
    Markup.button.callback(
      `${country.flag} ${country.name}`,

      `admin_server_country:${country.id}`,
    ),
  ]);

  return Markup.inlineKeyboard(buttons);
};

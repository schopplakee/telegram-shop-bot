const { Markup } = require("telegraf");

module.exports = function (services) {
  return Markup.inlineKeyboard(
    services.map((service) => [
      Markup.button.callback(
        `${service.server.country.flag} ${service.plan.name}`,
        `service:${service.id}`,
      ),
    ]),
  );
};

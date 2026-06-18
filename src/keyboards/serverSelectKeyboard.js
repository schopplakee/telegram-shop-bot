const { Markup } = require("telegraf");

module.exports = (servers) => {
  return Markup.inlineKeyboard([
    ...servers.map((server) => [
      Markup.button.callback(
        server.name,

        `plan_select_server:${server.id}`,
      ),
    ]),

    [
      Markup.button.callback(
        "⬅️ بازگشت",

        "admin_plan_back",
      ),
    ],
  ]);
};

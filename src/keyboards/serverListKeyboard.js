const { Markup } = require("telegraf");

module.exports = (servers) => {
  const buttons = servers.map((server) => [
    Markup.button.callback(
      `${server.name}`,
      `admin_server:${server.id}`,
    ),
  ]);

  buttons.push([
    Markup.button.callback(
      "⬅️ بازگشت",
      "admin_server_back",
    ),
  ]);

  return Markup.inlineKeyboard(buttons);
};

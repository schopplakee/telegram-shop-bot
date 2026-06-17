const { Markup } = require("telegraf");

module.exports = (servers) => {
  const rows = servers.map((server) => [
    Markup.button.callback(
      server.name,

      `admin_server:${server.id}`,
    ),
  ]);

  rows.push([
    Markup.button.callback(
      "⬅️ بازگشت",

      "admin_server_back",
    ),
  ]);

  return Markup.inlineKeyboard(rows);
};

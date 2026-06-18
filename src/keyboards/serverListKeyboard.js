const { Markup } = require("telegraf");

module.exports = (servers, action = "admin_server") => {
  const rows = servers.map((server) => [
    Markup.button.callback(
      server.name,

      `${action}:${server.id}`,
    ),
  ]);

  rows.push([
    Markup.button.callback(
      "⬅️ بازگشت",

      `${action}_back`,
    ),
  ]);

  return Markup.inlineKeyboard(rows);
};

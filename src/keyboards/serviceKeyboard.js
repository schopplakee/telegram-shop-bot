const { Markup } = require("telegraf");

module.exports = function (id, enabled = true) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📱 QR Code", `service_qr:${id}`),
      Markup.button.callback("🔗 لینک", `service_link:${id}`),
    ],

    [Markup.button.callback("📄 کانفیگ", `service_configs:${id}`)],

    [
      Markup.button.callback(
        enabled ? "⛔ توقف سرویس" : "✅ فعالسازی سرویس",
        `service_toggle:${id}`,
      ),
    ],

    [Markup.button.callback("♻️ تمدید سرویس", `service_renew:${id}`)],

    [Markup.button.callback("🔄 بروزرسانی", `service_refresh:${id}`)],

    [
      Markup.button.callback("♻️ لینک جدید", `service_newsub:${id}`),
      Markup.button.callback("🗑 حذف سرویس", `service_delete:${id}`),
    ],

    [Markup.button.callback("🏠 منوی اصلی", "menu")],
  ]);
};

const { Markup } = require("telegraf");

module.exports = function (id) {
  return Markup.inlineKeyboard([
    [Markup.button.callback("🔄 بروزرسانی", `service_refresh:${id}`)],

    [
      Markup.button.callback("📱 QR Code", `service_qr:${id}`),
      Markup.button.callback("🔗 لینک اشتراک", `service_link:${id}`),
    ],

    [Markup.button.callback("📄 کانفیگ", `service_config:${id}`)],

    [
      Markup.button.callback("⏸ توقف", `service_disable:${id}`),
      Markup.button.callback("▶️ فعال", `service_enable:${id}`),
    ],

    [Markup.button.callback("♻️ تمدید", `service_renew:${id}`)],

    [Markup.button.callback("🗑 حذف سرویس", `service_delete:${id}`)],

    [Markup.button.callback("🏠 منوی اصلی", "menu")],
  ]);
};

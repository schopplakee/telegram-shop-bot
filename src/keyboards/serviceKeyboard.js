const { Markup } = require("telegraf");

module.exports = function (serviceId) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback("📷 QR Code", `service_qr:${serviceId}`),
      Markup.button.callback("🔗 لینک اشتراک", `service_link:${serviceId}`),
    ],
    [
      Markup.button.callback("📥 کانفیگ‌ها", `service_configs:${serviceId}`),
      Markup.button.callback("🔄 بروزرسانی", `service_refresh:${serviceId}`),
    ],
    [
      Markup.button.callback("⛔ توقف سرویس", `service_toggle:${service.id}`),
      Markup.button.callback("♻️ تمدید", `service_renew:${serviceId}`),
    ],
    [
      Markup.button.callback("🔄 لینک جدید", `service_newlink:${serviceId}`),
      Markup.button.callback("📖 راهنما", `service_help:${serviceId}`),
    ],
    [Markup.button.callback("🗑 حذف سرویس", `service_delete:${serviceId}`)],
    [Markup.button.callback("🏠 منوی اصلی", "menu")],
  ]);
};

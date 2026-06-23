const { InlineKeyboard } = require("grammy");

module.exports = function (id) {
  return new InlineKeyboard()
    .text("🔄 بروزرسانی", `service_refresh:${id}`)
    .row()
    .text("📱 QR Code", `service_qr:${id}`)
    .text("🔗 لینک اشتراک", `service_link:${id}`)
    .row()
    .text("📄 کانفیگ", `service_config:${id}`)
    .row()
    .text("⏸ توقف", `service_disable:${id}`)
    .text("▶️ فعال", `service_enable:${id}`)
    .row()
    .text("♻️ تمدید", `service_renew:${id}`)
    .row()
    .text("🗑 حذف سرویس", `service_delete:${id}`)
    .row()
    .text("🏠 منوی اصلی", "menu");
};

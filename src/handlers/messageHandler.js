const menuController = require("../controllers/menuController");

const routes = {
  "🛒 خرید سرویس جدید": menuController.buyService,
  "💰 کیف پول من": menuController.wallet,
  "👤 سرویس‌های من": menuController.myServices,
  "💡 آموزش استفاده": menuController.guide,
  "📞 معرفی به دوستان": menuController.referral,
  "🧑‍💻 تیکت پشتیبانی": menuController.support,
};

module.exports = async (ctx) => {
  const text = ctx.message?.text;

  const handler = routes[text];

  if (handler) {
    return handler(ctx);
  }
};
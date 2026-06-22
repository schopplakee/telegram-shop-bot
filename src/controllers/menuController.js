const purchaseController = require("./purchaseController");
const serviceController = require("./serviceController");

async function buyService(ctx) {
  return purchaseController.startPurchase(ctx);
}

async function wallet(ctx) {
  return ctx.reply("💰 موجودی کیف پول شما: 0 تومان");
}

async function myServices(ctx) {
  return serviceController.list(ctx);
}

async function guide(ctx) {
  return ctx.reply("📚 آموزش استفاده به زودی اضافه می‌شود.");
}

async function referral(ctx) {
  return ctx.reply("🎁 سیستم معرفی دوستان به زودی فعال می‌شود.");
}

async function support(ctx) {
  return ctx.reply("📞 برای پشتیبانی با @support در ارتباط باشید.");
}

module.exports = {
  buyService,
  wallet,
  myServices,
  guide,
  referral,
  support,
};

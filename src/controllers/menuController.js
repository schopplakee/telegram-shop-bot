async function buyService(ctx) {
  return ctx.reply("🛒 لیست سرویس‌ها به زودی اینجا نمایش داده می‌شود.");
}

async function wallet(ctx) {
  return ctx.reply("💰 موجودی کیف پول شما: 0 تومان");
}

async function myServices(ctx) {
  return ctx.reply("👤 هنوز سرویسی برای شما ثبت نشده است.");
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
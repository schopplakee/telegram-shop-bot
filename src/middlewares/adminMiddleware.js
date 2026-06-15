const { ADMINS } = require("../config/admin");

module.exports = (ctx, next) => {

    const id = String(ctx.from.id);

    if (!ADMINS.includes(id)) {
        return ctx.reply("⛔ دسترسی ندارید.");
    }

    return next();

};
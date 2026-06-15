const adminKeyboard = require("../keyboards/adminKeyboard");
const adminMiddleware = require("../middlewares/adminMiddleware");

module.exports = (bot) => {

    bot.command("admin", adminMiddleware, async (ctx) => {

        return ctx.reply(
            "👑 پنل مدیریت",
            adminKeyboard
        );

    });

};
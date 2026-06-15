const countryKeyboard = require("../keyboards/countryAdminKeyboard");

module.exports = (bot) => {

    bot.hears("🌍 مدیریت کشورها", async (ctx) => {

        await ctx.reply(
            "🌍 مدیریت کشورها",
            countryKeyboard
        );

    });

};
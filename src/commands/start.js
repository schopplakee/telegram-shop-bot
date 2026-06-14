const mainKeyboard = require("../keyboards/mainKeyboard");
const { createOrUpdateUser } = require("../services/userService");

module.exports = (bot) => {

  bot.start(async (ctx) => {

    await createOrUpdateUser(ctx.from);

    return ctx.reply(
      "🖖 به ربات Arix خوش آمدید",
      mainKeyboard
    );

  });

};
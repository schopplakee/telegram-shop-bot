require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const messageHandler = require("./handlers/messageHandler");
const callbackHandler = require("./callbacks/callbackHandler");

require("./commands/start")(bot);
require("./commands/admin")(bot);

bot.on("text", messageHandler);
bot.on("callback_query", callbackHandler);
bot.on("document", messageHandler);
bot.on("callback_query", callbackHandler);

(async () => {
  try {
    await bot.launch();
    console.log("✅ Bot Started");
  } catch (err) {
    console.error("Launch Error:", err);
  }
})();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
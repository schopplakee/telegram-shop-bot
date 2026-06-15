require("dotenv").config();

const { Telegraf } = require("telegraf");

const bot = new Telegraf(process.env.BOT_TOKEN);

const messageHandler = require("./handlers/messageHandler");

require("./commands/start")(bot);

bot.on("text", messageHandler);

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
require("dotenv").config();

const xui = require("./src/services/xuiService");

(async () => {
  const cookie = await xui.login();

  console.log("COOKIE:", cookie);
})();

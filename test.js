require("dotenv").config();

const xui = require("./src/services/xuiService");

(async () => {
  const result = await xui.deleteClient("telegram-test");

  console.log(result);
})();

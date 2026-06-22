require("dotenv").config();

const purchaseService = require("./src/services/purchaseService");

(async () => {
  const result = await purchaseService.purchaseWithWallet(
    1, // serverId
    6, // planId
    1847297788 // telegramId
  );

  console.log(result);
})();
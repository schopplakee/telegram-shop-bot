require("dotenv").config();

const planService = require("./src/services/planService");

(async () => {
  const plan = await planService.getPlan(3);

  console.log(plan);
})();

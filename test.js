const planService = require("./src/services/planService");

(async () => {
  const plan = await planService.getPlan(4);

  console.log(plan);

  console.log(plan.server);

  console.log(plan.server.countryId);

  console.log(plan.server.inboundId);
})();

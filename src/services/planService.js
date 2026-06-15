const planRepository = require("../repositories/planRepository");

async function getPlans(serverId) {
  return planRepository.getPlans(serverId);
}

module.exports = {
  getPlans,
};
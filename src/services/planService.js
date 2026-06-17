const planRepository = require("../repositories/planRepository");

async function createPlan(data) {
  return planRepository.createPlan(data);
}

async function getPlans(serverId) {
  return planRepository.getPlans(serverId);
}

async function getPlan(id) {
  return planRepository.getPlan(id);
}

async function deletePlan(id) {
  return planRepository.deletePlan(id);
}

async function updatePlan(id, data) {
  return planRepository.updatePlan(id, data);
}

module.exports = {
  createPlan,
  getPlans,
  getPlan,
  deletePlan,
  updatePlan,
};

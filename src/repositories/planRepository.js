const prisma = require("../config/prisma");

async function createPlan(data) {
  return prisma.plan.create({
    data,
  });
}

async function getPlans(serverId) {
  return prisma.plan.findMany({
    where: {
      serverId,

      isActive: true,
    },

    orderBy: {
      price: "asc",
    },
  });
}

async function getPlan(id) {
  return prisma.plan.findUnique({
    where: {
      id,
    },
  });
}

async function deletePlan(id) {
  return prisma.plan.delete({
    where: {
      id,
    },
  });
}

async function updatePlan(id, data) {
  return prisma.plan.update({
    where: {
      id,
    },

    data,
  });
}

module.exports = {
  createPlan,
  getPlans,
  getPlan,
  deletePlan,
  updatePlan,
};

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function getPlans(serverId) {
  return prisma.plan.findMany({
    where: {
      serverId,
      isActive: true,
    },
    orderBy: {
      id: "asc",
    },
  });
}

async function getPlan(id) {
  return prisma.plan.findUnique({
    where: {
      id,
    },

    include: {
      server: true,
    },
  });
}

async function createPlan(data) {
  return prisma.plan.create({
    data,
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

async function deletePlan(id) {
  return prisma.plan.delete({
    where: {
      id,
    },
  });
}

module.exports = {
  getPlans,
  getPlan,
  createPlan,
  updatePlan,
  deletePlan,
};

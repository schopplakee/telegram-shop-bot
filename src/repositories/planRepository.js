const prisma = require("../config/prisma");

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

module.exports = {
  getPlans,
};
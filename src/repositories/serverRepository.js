const prisma = require("../config/prisma");

async function getServersByCountry(countryId) {
  return prisma.server.findMany({
    where: {
      countryId,
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

module.exports = {
  getServersByCountry,
};
const prisma = require("../config/prisma");

async function getAllCountries() {
  return prisma.country.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
}

module.exports = {
  getAllCountries,
};
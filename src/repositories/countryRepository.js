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

async function createCountry(data) {
  return prisma.country.create({
    data,
  });
}

async function getCountryByCode(code) {
  return prisma.country.findUnique({
    where: {
      code,
    },
  });
}

module.exports = {
  getAllCountries,
  createCountry,
  getCountryByCode,
};
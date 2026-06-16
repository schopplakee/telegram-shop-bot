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

async function getCountry(id) {

    return prisma.country.findUnique({

        where: {

            id

        }

    });

}

module.exports = {
  getAllCountries,
  createCountry,
  getCountryByCode,
  getCountry,
};
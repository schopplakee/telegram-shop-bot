const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(data) {
  return prisma.order.create({
    data,
  });
}

module.exports = {
  create,
};

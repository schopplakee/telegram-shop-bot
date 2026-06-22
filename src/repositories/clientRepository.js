const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(data) {
  return prisma.service.create({
    data,
  });
}

async function getByUser(userId) {
  return prisma.service.findMany({
    where: {
      userId,
    },
    include: {
      server: true,
      plan: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

module.exports = {
  create,
  getByUser,
};

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(data) {
  return prisma.service.create({
    data: {
      userId: data.userId,

      serverId: data.serverId,

      planId: data.planId,

      uuid: data.uuid,

      email: data.email,

      subscriptionUrl: data.subscriptionUrl,

      status: data.status ?? "ACTIVE",

      expireAt: data.expireAt,

      trafficLimit: BigInt(data.trafficLimit),

      trafficUsed: BigInt(data.trafficUsed ?? 0),
    },
  });
}

async function getByUser(userId) {
  return prisma.service.findMany({
    where: {
      userId,
    },
    include: {
      server: {
        include: {
          country: true,
        },
      },
      plan: true,
    },
    orderBy: {
      id: "desc",
    },
  });
}

module.exports = {
  create,
  getByUser,
};

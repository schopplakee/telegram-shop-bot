const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function create(data) {
  return prisma.order.create({
    data: {
      userId: data.userId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      status: data.status,
      authority: data.authority ?? null,
      refId: data.refId ?? null,
    },
  });
}

async function updateStatus(id, status) {
  return prisma.order.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
}

module.exports = {
  create,
  updateStatus,
};

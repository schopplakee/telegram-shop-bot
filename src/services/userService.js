const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createOrUpdateUser(user) {
  return prisma.user.upsert({
    where: {
      telegramId: String(user.id),
    },
    update: {
      username: user.username,
      firstName: user.first_name,
    },
    create: {
      telegramId: String(user.id),
      username: user.username,
      firstName: user.first_name,
    },
  });
}

async function getByTelegramId(telegramId) {
  return prisma.user.findUnique({
    where: {
      telegramId: String(telegramId),
    },
  });
}

async function updateBalance(userId, balance) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      balance,
    },
  });
}

module.exports = {
  createOrUpdateUser,
  getByTelegramId,
  updateBalance,
};

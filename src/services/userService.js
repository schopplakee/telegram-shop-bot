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

module.exports = {
  createOrUpdateUser,
};
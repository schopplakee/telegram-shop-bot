const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const userService = require("./userService");

async function decrease(user, amount, description = "خرید سرویس") {
  if (user.balance < amount) {
    throw new Error("Insufficient balance");
  }

  await userService.updateBalance(user.id, user.balance - amount);

  await prisma.walletTransaction.create({
    data: {
      userId: user.id,
      amount,
      type: "DEBIT",
      description,
    },
  });
}

module.exports = {
  decrease,
};

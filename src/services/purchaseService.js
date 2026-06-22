const crypto = require("crypto");

const serverService = require("./serverService");
const planService = require("./planService");
const xuiService = require("./xuiService");

const userService = require("./userService");
const walletService = require("./walletService");
const orderService = require("./orderService");
const clientService = require("./clientService");

module.exports = {
  async createSubscription(serverId, planId) {
    const server = await serverService.getServer(serverId);

    const plan = await planService.getPlan(planId);

    if (!server) throw new Error("SERVER_NOT_FOUND");
    if (!plan) throw new Error("PLAN_NOT_FOUND");

    const totalGB = plan.traffic * 1024 * 1024 * 1024;

    const expiryTime = Date.now() + plan.days * 24 * 60 * 60 * 1000;

    const email = crypto.randomBytes(5).toString("hex");

    await xuiService.addClient(server.inboundId, {
      email,
      totalGB,
      expiryTime,
    });

    const { inbound, client } = await xuiService.getClient(email);

    const subscriptionUrl = xuiService.buildSubscriptionUrl(inbound, client);

    return {
      server,
      plan,
      inbound,
      client,
      subscriptionUrl,
    };
  },

  async purchaseWithWallet(serverId, planId, telegramId) {
    const user = await userService.getByTelegramId(telegramId);

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    const plan = await planService.getPlan(planId);

    if (!plan) {
      throw new Error("PLAN_NOT_FOUND");
    }

    if (user.balance < plan.price) {
      throw new Error("NOT_ENOUGH_BALANCE");
    }

    // ساخت سرویس فقط بعد از تایید موجودی
    const result = await this.createSubscription(serverId, planId);

    // کسر موجودی
    await walletService.decrease(user, plan.price, `خرید پلن ${plan.name}`);

    // ثبت سفارش
    await orderService.create({
      userId: user.id,
      amount: plan.price,
      paymentMethod: "WALLET",
      status: "SUCCESS",
    });

    // ذخیره سرویس
    await clientService.create({
      userId: user.id,
      serverId,
      planId,
      uuid: result.client.id,
      email: result.client.email,
      subscriptionUrl: result.subscriptionUrl,
      expireAt: new Date(result.client.expiryTime),
      trafficLimit: result.client.totalGB,
    });

    return result;
  },
};

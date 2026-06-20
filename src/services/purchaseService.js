const serverService = require("./serverService");
const planService = require("./planService");
const xuiService = require("./xuiService");

module.exports = {
  async createSubscription(serverId, planId, user) {
    const server = await serverService.getServer(serverId);
    const plan = await planService.getPlan(planId);
    const totalGB = plan.traffic * 1024 * 1024 * 1024;
    const expiryTime = Date.now() + plan.days * 24 * 60 * 60 * 1000;
    const email = `tg-${user.id}`;
    const client = await xuiService.addClient(server.inboundId, {
      email,
      totalGB,
      expiryTime,
    });

    return {
      server,
      plan,
      client,
    };
  },
};

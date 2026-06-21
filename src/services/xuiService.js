const axios = require("axios");
const crypto = require("crypto");

const client = axios.create({
  baseURL: process.env.XUI_URL,
  validateStatus: () => true,
});

let cookie = null;
let csrf = null;

async function login() {
  if (cookie) return cookie;

  // Step 1
  const page = await client.get("/");

  const firstCookie = page.headers["set-cookie"]
    ?.map((c) => c.split(";")[0])
    .join("; ");

  const html = page.data;

  csrf = html.match(/<meta name="csrf-token" content="([^"]+)"/)?.[1];

  if (!csrf) throw new Error("CSRF Token Not Found");

  // Step 2
  const response = await client.post(
    "/login",

    new URLSearchParams({
      username: process.env.XUI_USERNAME,

      password: process.env.XUI_PASSWORD,
    }),

    {
      headers: {
        Cookie: firstCookie,

        "X-CSRF-Token": csrf,

        "X-Requested-With": "XMLHttpRequest",

        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    },
  );

  console.log(response.status);
  console.log(response.data);

  cookie = response.headers["set-cookie"]
    ?.map((c) => c.split(";")[0])
    .join("; ");

  return cookie;
}

async function getInbounds() {
  await login();

  const response = await client.get("/panel/api/inbounds/list", {
    headers: {
      Cookie: cookie,
    },
  });

  return response.data;
}

async function addClient(inboundId, data) {
  await login();

  const response = await client.post(
    "/panel/api/clients/add",

    {
      client: {
        id: crypto.randomUUID(),

        email: data.email,

        enable: true,

        totalGB: data.totalGB,

        expiryTime: data.expiryTime,

        limitIp: data.limitIp ?? 0,

        tgId: 0,

        flow: "",

        security: "auto",

        comment: "",

        group: "",

        subId: crypto.randomBytes(8).toString("hex"),

        password: crypto.randomBytes(8).toString("hex"),

        auth: crypto.randomBytes(8).toString("hex"),
      },

      inboundIds: [Number(inboundId)],
    },

    {
      headers: {
        Cookie: cookie,

        "X-CSRF-Token": csrf,

        "X-Requested-With": "XMLHttpRequest",
      },

      validateStatus: () => true,
    },
  );

  console.log("STATUS:", response.status);
  console.log("DATA:", response.data);

  return response.data;
}

async function deleteClient(email) {
  await login();

  const response = await client.post(
    `/panel/api/clients/del/${email}`,

    null,

    {
      headers: {
        Cookie: cookie,
        "X-CSRF-Token": csrf,
        "X-Requested-With": "XMLHttpRequest",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },

      validateStatus: () => true,
    },
  );

  console.log(response.status);
  console.log(response.data);

  return response.data;
}

async function updateClient(clientData) {
  await login();

  const response = await client.post(
    `/panel/api/clients/update/${clientData.email}`,

    clientData,

    {
      headers: {
        Cookie: cookie,
        "X-CSRF-Token": csrf,
        "X-Requested-With": "XMLHttpRequest",
      },
      validateStatus: () => true,
    },
  );

  console.log(response.status);
  console.log(response.data);

  return response.data;
}

async function toggleClient(uuid, enable) {
  await login();

  const response = await client.post(
    "/panel/api/clients/status",

    {
      clientIds: [uuid],
      enable,
    },

    {
      headers: {
        Cookie: cookie,
        "X-CSRF-Token": csrf,
        "X-Requested-With": "XMLHttpRequest",
      },

      validateStatus: () => true,
    },
  );

  return response.data;
}

async function getClient(email) {
  const inbounds = await getInbounds();

  for (const inbound of inbounds.obj) {
    const client = inbound.settings.clients.find((c) => c.email === email);

    if (client) {
      return {
        inbound,
        client,
      };
    }
  }

  return null;
}

async function createClient(plan) {
  const inbounds = await getInbounds();

  const inbound = inbounds.obj.find((i) => i.id === plan.server.inboundId);

  if (!inbound) throw new Error("Inbound Not Found");

  const email = Math.random().toString(36).substring(2, 10);

  const totalGB = plan.traffic * 1024 * 1024 * 1024;

  const expiryTime = Date.now() + plan.days * 24 * 60 * 60 * 1000;

  await addClient(
    inbound.id,

    {
      email,

      totalGB,

      expiryTime,
    },
  );

  const result = await getClient(email);

  return {
    inbound,

    client: result.client,
  };
}

module.exports = {
  login,
  getInbounds,
  addClient,
  deleteClient,
  updateClient,
  toggleClient,
  getClient,
  createClient,
};

const axios = require("axios");
const crypto = require("crypto");

console.log("XUI_URL =", process.env.XUI_URL);

const client = axios.create({
  baseURL: process.env.XUI_URL,
  validateStatus: () => true,
});

let cookie = null;
let csrf = null;

async function login() {
  console.log("BaseURL:", client.defaults.baseURL);

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

async function toggleClient(email, enable) {
  await login();

  const response = await client.post(
    `/panel/api/clients/${enable ? "enable" : "disable"}`,

    {
      email,
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

  console.log(response.status);
  console.log(response.data);

  return response.data;
}

async function getClient(email) {
  const inbounds = await getInbounds();

  for (const inbound of inbounds.obj) {
    const stat = inbound.clientStats.find((c) => c.email === email);

    if (stat) {
      return {
        inbound,
        client: stat,
      };
    }
  }

  return null;
}

async function createClient(data) {
  const inbounds = await getInbounds();

  const inbound = inbounds.obj.find((i) => i.id === Number(data.inboundId));

  if (!inbound) {
    throw new Error("Inbound Not Found");
  }

  await addClient(inbound.id, {
    email: data.email,

    totalGB: data.totalGB,

    expiryTime: data.expiryTime,

    limitIp: data.limitIp ?? 0,
  });

  const result = await getClient(data.email);

  return {
    inbound,
    client: result.client,
  };
}

function buildSubscriptionUrl(inbound, client) {
  const protocol = "vless";

  const host = new URL(process.env.XUI_URL).hostname;

  const tls = inbound.streamSettings?.security ?? "none";

  const network = inbound.streamSettings?.network ?? "tcp";

  const remark = encodeURIComponent(inbound.remark || inbound.tag || "Server");

  return `${protocol}://${client.id}@${host}:${inbound.port}?encryption=none&type=${network}&security=${tls}#${remark}`;
}

async function getClientStats(email) {
  const result = await getClient(email);

  if (!result) {
    throw new Error("CLIENT_NOT_FOUND");
  }

  const inbound = result.inbound;
  const client = result.client;

  const stat = inbound.clientStats.find((s) => s.email === email);

  return {
    inbound,
    client,
    stat,
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
  buildSubscriptionUrl,
  getClientStats,
};

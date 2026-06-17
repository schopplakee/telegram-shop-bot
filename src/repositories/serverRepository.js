const prisma = require("../config/prisma");

async function getAllServers() {
  return prisma.server.findMany({
    include: {
      country: true,
      panel: true,
    },

    orderBy: {
      id: "asc",
    },
  });
}

async function getServer(id) {
  return prisma.server.findUnique({
    where: {
      id,
    },

    include: {
      country: true,
      panel: true,
    },
  });
}

async function createServer(data) {
  return prisma.server.create({
    data,
  });
}

async function deleteServer(id) {
  return prisma.server.delete({
    where: {
      id,
    },
  });
}

async function updateServer(id, data) {
  return prisma.server.update({
    where: {
      id,
    },

    data,
  });
}

module.exports = {
  getAllServers,
  getServer,
  createServer,
  deleteServer,
  updateServer,
};

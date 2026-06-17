const prisma = require("../config/prisma");

async function getAllPanels() {
  return prisma.panel.findMany({
    where: {
      isActive: true,
    },

    orderBy: {
      name: "asc",
    },
  });
}

async function getPanel(id) {
  return prisma.panel.findUnique({
    where: {
      id,
    },
  });
}

async function getPanelByName(name) {
  return prisma.panel.findFirst({
    where: {
      name,
    },
  });
}

async function createPanel(data) {
  return prisma.panel.create({
    data,
  });
}

async function updatePanel(id, data) {
  return prisma.panel.update({
    where: {
      id,
    },

    data,
  });
}

async function deletePanel(id) {
  return prisma.panel.delete({
    where: {
      id,
    },
  });
}

module.exports = {
  getAllPanels,
  getPanel,
  getPanelByName,
  createPanel,
  updatePanel,
  deletePanel,
};

const serverRepository = require("../repositories/serverRepository");

async function getServers() {
  return serverRepository.getAllServers();
}

async function getServer(id) {
  return serverRepository.getServer(id);
}

async function createServer(data) {
  return serverRepository.createServer(data);
}

async function updateServer(id, data) {
  return serverRepository.updateServer(id, data);
}

async function deleteServer(id) {
  return serverRepository.deleteServer(id);
}

async function updateServer(id, data) {
  return repository.updateServer(id, data);
}

module.exports = {
  getServers,
  getServer,
  createServer,
  updateServer,
  deleteServer,
};

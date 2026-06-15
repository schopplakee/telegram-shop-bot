const serverRepository = require("../repositories/serverRepository");

async function getServers(countryId) {
  return serverRepository.getServersByCountry(countryId);
}

module.exports = {
  getServers,
};
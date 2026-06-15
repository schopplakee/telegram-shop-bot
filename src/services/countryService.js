const countryRepository = require("../repositories/countryRepository");

async function getCountries() {
  return countryRepository.getAllCountries();
}

module.exports = {
  getCountries,
};
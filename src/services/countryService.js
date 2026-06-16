const countryRepository = require("../repositories/countryRepository");

async function getCountries() {
  return countryRepository.getAllCountries();
}

async function createCountry(data) {
  return countryRepository.createCountry(data);
}

async function countryExists(code) {
  const country = await countryRepository.getCountryByCode(code);

  return !!country;
}

async function getCountry(id) {

    return countryRepository.getCountry(id);

}

async function deleteCountry(id) {

    return countryRepository.deleteCountry(id);

}

module.exports = {
  getCountries,
  createCountry,
  countryExists,
  getCountry,
  deleteCountry,
};
const repository = require("../repositories/sessionRepository");

module.exports = {

    async getSession(id) {

        return repository.get(id);

    },

    async setSession(id, module, step, data = {}) {

        return repository.set(id, module, step, data);

    },

    async clearSession(id) {

        return repository.clear(id);

    }

};
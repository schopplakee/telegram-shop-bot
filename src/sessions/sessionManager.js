const sessionService = require("../services/sessionService");

module.exports = {

    async start(userId, module, step, data = {}) {

        return sessionService.setSession(
            userId,
            module,
            step,
            data
        );

    },

    async get(userId) {

        return sessionService.getSession(userId);

    },

    async next(userId, step, data) {

        const session = await sessionService.getSession(userId);

        if (!session) return null;

        return sessionService.setSession(

            userId,

            session.module,

            step,

            data

        );

    },

    async clear(userId) {

        return sessionService.clearSession(userId);

    }

};
const sessionManager = require("../sessions/sessionManager");

const SESSION_MODULES = require("../constants/sessionModules");
const SESSION_STEPS = require("../constants/sessionSteps");

module.exports = {

    async addCountry(ctx) {

        await sessionManager.start(

            ctx.from.id,

            SESSION_MODULES.COUNTRY,

            SESSION_STEPS.NAME

        );

        return ctx.reply(
            "🌍 لطفاً نام کشور را وارد کنید."
        );

    },

    async listCountries(ctx) {

        return ctx.reply(
            "📋 هنوز کشوری ثبت نشده است."
        );

    }

};
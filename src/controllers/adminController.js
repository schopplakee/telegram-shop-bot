const adminMenu = require("../constants/adminMenu");
const countryKeyboard = require("../keyboards/countryAdminKeyboard");

module.exports = {

    countries: async (ctx) => {

        return ctx.reply(
            "🌍 مدیریت کشورها",
            countryKeyboard
        );

    },

    servers: async (ctx) => {

        return ctx.reply("🖥 مدیریت سرورها");

    },

    plans: async (ctx) => {

        return ctx.reply("📦 مدیریت پلن‌ها");

    },

    users: async (ctx) => {

        return ctx.reply("👥 مدیریت کاربران");

    }

};
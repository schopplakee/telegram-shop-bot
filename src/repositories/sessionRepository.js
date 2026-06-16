const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

module.exports = {

    async get(telegramId) {

        return prisma.session.findUnique({

            where: {

                telegramId: String(telegramId)

            }

        });

    },

    async set(telegramId, module, step, data = {}) {

        return prisma.session.upsert({

            where: {

                telegramId: String(telegramId)

            },

            update: {

                module,
                step,
                data

            },

            create: {

                telegramId: String(telegramId),

                module,

                step,

                data

            }

        });

    },

    async clear(telegramId) {

        return prisma.session.deleteMany({

            where: {

                telegramId: String(telegramId)

            }

        });

    }

};
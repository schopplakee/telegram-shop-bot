const { Markup } = require("telegraf");

module.exports = (countries) => {

    const buttons = countries.map(country => [

        Markup.button.callback(

            `${country.flag} ${country.name}`,

            `country:${country.id}`

        )

    ]);

    buttons.push([

        Markup.button.callback("⬅️ بازگشت", "admin")

    ]);

    return Markup.inlineKeyboard(buttons);

};
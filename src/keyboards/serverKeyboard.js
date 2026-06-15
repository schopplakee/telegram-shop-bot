const { Markup } = require("telegraf");
const ACTION = require("../constants/callbackActions");

function serverKeyboard(servers){

    return Markup.inlineKeyboard(

        servers.map(server=>[

            Markup.button.callback(

                server.name,

                `${ACTION.SERVER}:${server.id}`

            )

        ])

    );

}

module.exports={

    serverKeyboard

}
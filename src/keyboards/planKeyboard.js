const { Markup } = require("telegraf");
const ACTION = require("../constants/callbackActions");

function planKeyboard(plans){

    return Markup.inlineKeyboard(

        plans.map(plan=>[

            Markup.button.callback(

                `${plan.name} - ${plan.price.toLocaleString()} تومان`,

                `${ACTION.PLAN}:${plan.id}`

            )

        ])

    );

}

module.exports={

    planKeyboard

}
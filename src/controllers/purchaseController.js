const purchaseKeyboard=require("../keyboards/purchaseKeyboard");

const countryService=require("../services/countryService");

async function startPurchase(ctx){

    const countries=await countryService.getCountries();

    return ctx.reply(

        "🌍 کشور موردنظر را انتخاب کنید",

        purchaseKeyboard.countryKeyboard(countries)

    );

}

module.exports={

    startPurchase

}
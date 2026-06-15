async function getPlans(serverId){
 
    return [

        {
            id:1,
            name:"30 روز | 50 گیگ",
            price: "120,000"
        },

        {
            id:2,
            name:"60 روز | 100 گیگ",
            price: "220,000"
        },

        {
            id:3,
            name:"90 روز | نامحدود",
            price: "350,000"
        }

    ];

}

module.exports = {

    getPlans

}
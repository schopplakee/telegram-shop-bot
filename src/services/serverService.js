async function getServers(countryId){

    const data={

        1:[
            {id:1,name:"آلمان 1"},
            {id:2,name:"آلمان VIP"}
        ],

        2:[
            {id:3,name:"فنلاند 1"}
        ],

        3:[
            {id:4,name:"ترکیه 1"},
            {id:5,name:"ترکیه VIP"}
        ],

        4:[
            {id:6,name:"هلند 1"}
        ]

    };

    return data[countryId]||[];

}

module.exports={

    getServers

}
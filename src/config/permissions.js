const PERMISSIONS = {

    utenti: {

        view: ["admin"],
        create: ["admin"],
        update: ["admin"],
        delete: ["admin"]

    },

    templateReferti: {

        view: ["admin"],
        create: ["admin"],
        update: ["admin"],
        delete: ["admin"]

    },

    pazienti: {

        view: [
            "admin",
            "medico",
            "infermiere",
            "segreteria"
        ],

        create: [
            "admin",
            "infermiere",
            "segreteria"
        ],

        update: [
            "admin",
            "infermiere",
            "segreteria"
        ],

        delete: [
            "admin"
        ]

    },


    referti: {

        view: [
            "admin",
            "medico",
            "infermiere"
        ],

        create: [
            "admin",
            "medico",
            "infermiere"
        ],

        update: [
            "admin",
            "medico",
            "infermiere"
        ],

        sign: [
            "admin",
            "medico"
        ],

        delete: [
            "admin"
        ]

    },

    operatori: {

    view: [
        "admin",
        "medico",
        "infermiere",
        "segreteria"
    ],

    create: [
        "admin"
    ],

    update: [
        "admin"
    ],

    delete: [
        "admin"
    ]

},

prestazioni: {

    view: [
        "admin",
        "medico",
        "infermiere",
        "segreteria"
    ],

    create: [
        "admin",
        "medico",
        "infermiere"
    ],

    update: [
        "admin",
        "medico",
        "infermiere"
    ],

    delete: [
        "admin"
    ]

},

catalogoPrestazioni: {

    view: [
        "admin",
        "medico",
        "infermiere",
        "segreteria"
    ],

    create: [
        "admin"
    ],

    update: [
        "admin"
    ],

    delete: [
        "admin"
    ]

},

pazienti: {

    view: [
        "admin",
        "medico",
        "infermiere",
        "segreteria"
    ],

    create: [
        "admin",
        "infermiere",
        "segreteria"
    ],

    update: [
        "admin",
        "infermiere",
        "segreteria"
    ],

    delete: [
        "admin"
    ]

},

cartellaClinica: {

    view: [
        "admin",
        "medico",
        "infermiere"
    ],

    create: [
        "admin",
        "medico",
        "infermiere"
    ],

    update: [
        "admin",
        "medico",
        "infermiere"
    ],

    delete: [
        "admin"
    ]

},
    specialita: {

    view: [
        "admin",
        "medico",
        "infermiere",
        "segreteria"
    ],

    create: [
        "admin"
    ],

    update: [
        "admin"
    ],

    delete: [
        "admin"
    ]

}

};

module.exports = PERMISSIONS;
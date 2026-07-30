const db = require("../config/db");

exports.getDashboard = (req, res) => {

    try {

        // Totale pazienti
        const totPazienti = db.prepare(`
            SELECT COUNT(*) AS totale
            FROM pazienti
        `).get().totale;

        // Operatori attivi
        const operatoriAttivi = db.prepare(`
            SELECT COUNT(*) AS totale
            FROM operatori
            WHERE attivo = 1
        `).get().totale;

        

        // Appuntamenti di oggi
        const appuntamentiOggi = db.prepare(`
            SELECT COUNT(*) AS totale
            FROM appuntamenti
            WHERE data = DATE('now','localtime')
        `).get().totale;

        // Referti da completare
        const refertiDaCompletare = db.prepare(`
            SELECT COUNT(*) AS totale
            FROM prestazioni p
            LEFT JOIN referti r
                ON r.prestazione_id = p.id
            WHERE r.id IS NULL
        `).get().totale;

        // Agenda di oggi
        const agendaOggi = db.prepare(`
            SELECT
                a.id,
                a.data_ora_inizio,
                a.stato,
                pa.nome,
                pa.cognome,
                pc.descrizione AS prestazione,
                o.nome || ' ' || o.cognome AS operatore

            FROM appuntamenti a

            LEFT JOIN pazienti pa
                ON pa.id = a.paziente_id

            LEFT JOIN prestazioni_catalogo pc
                ON pc.id = a.prestazione_id

            LEFT JOIN operatori o
                ON o.id = a.operatore_id

            WHERE a.data = DATE('now','localtime')

            ORDER BY a.data_ora_inizio
        `).all();

        // Ultimi pazienti inseriti
        const ultimiPazienti = db.prepare(`
            SELECT
                id,
                nome,
                cognome,
                created_at
            FROM pazienti
            ORDER BY created_at DESC
            LIMIT 5
        `).all();

         const prestazioniDaRefertare = db.prepare(`
            SELECT
                p.id,
                p.data,
                pa.nome,
                pa.cognome,
                pc.descrizione AS prestazione
            FROM prestazioni p
            INNER JOIN pazienti pa
                ON pa.id = p.paziente_id
            INNER JOIN prestazioni_catalogo pc
                ON pc.id = p.prestazione_catalogo_id
            LEFT JOIN referti r
                ON r.prestazione_id = p.id
            WHERE r.id IS NULL
            ORDER BY p.data DESC
            LIMIT 10
        `).all();

       res.json({

    statistiche: {

        pazienti: totPazienti,

        operatori: operatoriAttivi,

        appuntamentiOggi,

        refertiDaCompletare

    },

    agendaOggi,

    ultimiPazienti,

    prestazioniDaRefertare

});

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
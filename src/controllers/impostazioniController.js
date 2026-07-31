const db = require("../config/db");

exports.getStudio = (req, res) => {

    try {

        const studio = db.prepare(`
            SELECT *
            FROM impostazioni_studio
            WHERE id = 1
        `).get();

        console.log("===== DEBUG STUDIO =====");
console.log("Logo dal DB:", studio?.logo);
console.log("========================");

        res.json(studio || {});

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

exports.salvaStudio = (req, res) => {

    try {

        const {

            nome,
            logo,
            indirizzo,
            cap,
            comune,
            provincia,
            telefono,
            email,
            sito,
            partita_iva,
            codice_fiscale,
            direttore_sanitario,
            colore

        } = req.body;

        db.prepare(`
            UPDATE impostazioni_studio
            SET
                nome=?,
                logo=?,
                indirizzo=?,
                cap=?,
                comune=?,
                provincia=?,
                telefono=?,
                email=?,
                sito=?,
                partita_iva=?,
                codice_fiscale=?,
                direttore_sanitario=?,
                colore=?
            WHERE id=1
        `).run(

            nome,
            logo,
            indirizzo,
            cap,
            comune,
            provincia,
            telefono,
            email,
            sito,
            partita_iva,
            codice_fiscale,
            direttore_sanitario,
            colore

        );

        res.json({

            messaggio: "Impostazioni salvate"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

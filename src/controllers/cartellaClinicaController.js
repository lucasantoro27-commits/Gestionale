const db = require("../config/db");

// ======================================
// Restituisce la cartella clinica
// (la crea automaticamente se non esiste)
// ======================================

exports.getCartellaClinica = (req, res) => {

    const { id } = req.params;

    try {

        // Verifica esistenza paziente
        const paziente = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE id = ?
        `).get(id);

        if (!paziente) {
            return res.status(404).json({
                errore: "Paziente non trovato"
            });
        }

        // Cerca la cartella
        let cartella = db.prepare(`
            SELECT *
            FROM cartelle_cliniche
            WHERE paziente_id = ?
        `).get(id);

        // Se non esiste la crea
        if (!cartella) {

            const insert = db.prepare(`
                INSERT INTO cartelle_cliniche
                (
                    paziente_id,
                    anamnesi,
                    allergie,
                    patologie,
                    terapia_domiciliare,
                    note_cliniche
                )
                VALUES (?, '', '', '', '', '')
            `);

            const result = insert.run(id);

            cartella = db.prepare(`
                SELECT *
                FROM cartelle_cliniche
                WHERE id = ?
            `).get(result.lastInsertRowid);

        }

       const prestazioni = db.prepare(`
    SELECT
        p.id,
        p.data,
        p.note,
        pc.descrizione AS prestazione,
        o.nome || ' ' || o.cognome AS operatore
    FROM prestazioni p

    LEFT JOIN prestazioni_catalogo pc
        ON pc.id = p.prestazione_catalogo_id

    LEFT JOIN operatori o
        ON o.id = p.operatore_id

    WHERE p.paziente_id = ?

    ORDER BY p.data DESC
`).all(id);

        // Prenotazioni
      const appuntamenti = db.prepare(`
    SELECT *
    FROM appuntamenti
    WHERE paziente_id = ?
    ORDER BY data_ora_inizio DESC
`).all(id);

        // Referti
        const referti = db.prepare(`
            SELECT *
            FROM referti
            WHERE paziente_id = ?
        `).all(id);

        // Documenti
        const documenti = db.prepare(`
            SELECT *
            FROM documenti
            WHERE paziente_id = ?
        `).all(id);

        // Consensi
        const consensi = db.prepare(`
            SELECT *
            FROM consensi
            WHERE paziente_id = ?
        `).all(id);

        res.json({

            paziente,

            cartella,

            prestazioni,

            appuntamenti,

            referti,

            documenti,

            consensi

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ======================================
// Aggiorna cartella clinica
// ======================================

exports.update = (req, res) => {

    const { id } = req.params;

    const {

        anamnesi,

        allergie,

        patologie,

        terapia_domiciliare,

        note_cliniche

    } = req.body;

    try {

        const result = db.prepare(`
            UPDATE cartelle_cliniche
            SET

                anamnesi = ?,

                allergie = ?,

                patologie = ?,

                terapia_domiciliare = ?,

                note_cliniche = ?,

                data_modifica = CURRENT_TIMESTAMP

            WHERE paziente_id = ?
        `).run(

            anamnesi,

            allergie,

            patologie,

            terapia_domiciliare,

            note_cliniche,

            id

        );

        if (result.changes === 0) {

            return res.status(404).json({
                errore: "Cartella non trovata"
            });

        }

        res.json({
            messaggio: "Cartella clinica aggiornata"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
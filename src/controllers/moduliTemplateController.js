const db = require("../config/db");
const registraAudit = require("../utils/auditMiddleware");

// ===============================
// ELENCO TEMPLATE
// ===============================

exports.getAll = async (req, res) => {
    try {

        const rows = db.prepare(`
            SELECT
                mt.*,
                mc.nome AS categoria
            FROM moduli_template mt
            LEFT JOIN modulistica_categorie mc
                ON mc.id = mt.categoria_id
            ORDER BY
                mc.ordine,
                mt.titolo
        `).all();

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }
};

// ===============================
// SINGOLO TEMPLATE
// ===============================

exports.getOne = async (req, res) => {

    try {

        const row = db.prepare(`
            SELECT *
            FROM moduli_template
            WHERE id = ?
        `).get(req.params.id);

        if (!row) {
            return res.status(404).json({
                errore: "Template non trovato"
            });
        }

        res.json(row);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===============================
// TEMPLATE PER CATEGORIA
// ===============================

exports.getByCategoria = async (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT *
            FROM moduli_template
            WHERE categoria_id = ?
            ORDER BY titolo
        `).all(req.params.id);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===============================
// NUOVO TEMPLATE
// ===============================

exports.create = async (req, res) => {

    try {

        const {
            titolo,
            categoria_id,
            descrizione,
            tipo,
            contenuto_html,
            versione,
            attivo,
            obbligatorio,
            compilabile,
            richiede_firma_paziente,
            richiede_firma_operatore,
            validita_mesi
        } = req.body;

        const result = db.prepare(`
            INSERT INTO moduli_template (

                titolo,
                categoria_id,
                descrizione,
                tipo,
                contenuto_html,
                versione,
                attivo,
                obbligatorio,
                compilabile,
                richiede_firma_paziente,
                richiede_firma_operatore,
                validita_mesi

            )

            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        `).run(

            titolo,
            categoria_id || null,
            descrizione || "",
            tipo || "consenso",
            contenuto_html || "",
            versione || "1.0",
            attivo ?? 1,
            obbligatorio ?? 0,
            compilabile ?? 1,
            richiede_firma_paziente ?? 1,
            richiede_firma_operatore ?? 1,
            validita_mesi ?? 0

        );

        await registraAudit({

            req,

            azione: "INSERIMENTO",

            tabella: "moduli_template",

            recordId: result.lastInsertRowid,

            dopo: req.body

        });

        res.status(201).json({

            messaggio: "Template creato",

            id: result.lastInsertRowid

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ===============================
// MODIFICA TEMPLATE
// ===============================

exports.update = async (req, res) => {

    try {

        const vecchio = db.prepare(`
            SELECT *
            FROM moduli_template
            WHERE id = ?
        `).get(req.params.id);

        if (!vecchio) {

            return res.status(404).json({

                errore: "Template non trovato"

            });

        }

        const {

            titolo,
            categoria_id,
            descrizione,
            tipo,
            contenuto_html,
            versione,
            attivo,
            obbligatorio,
            compilabile,
            richiede_firma_paziente,
            richiede_firma_operatore,
            validita_mesi

        } = req.body;

        db.prepare(`

            UPDATE moduli_template

            SET

                titolo=?,
                categoria_id=?,
                descrizione=?,
                tipo=?,
                contenuto_html=?,
                versione=?,
                attivo=?,
                obbligatorio=?,
                compilabile=?,
                richiede_firma_paziente=?,
                richiede_firma_operatore=?,
                validita_mesi=?,
                updated_at=CURRENT_TIMESTAMP

            WHERE id=?

        `).run(

            titolo,
            categoria_id || null,
            descrizione,
            tipo,
            contenuto_html,
            versione,
            attivo,
            obbligatorio,
            compilabile,
            richiede_firma_paziente,
            richiede_firma_operatore,
            validita_mesi,
            req.params.id

        );

        await registraAudit({

            req,

            azione: "MODIFICA",

            tabella: "moduli_template",

            recordId: req.params.id,

            prima: vecchio,

            dopo: req.body

        });

        res.json({

            messaggio: "Template aggiornato"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ===============================
// ELIMINA TEMPLATE
// ===============================

exports.remove = async (req, res) => {

    try {

        const vecchio = db.prepare(`
            SELECT *
            FROM moduli_template
            WHERE id = ?
        `).get(req.params.id);

        if (!vecchio) {

            return res.status(404).json({

                errore: "Template non trovato"

            });

        }

        db.prepare(`
            DELETE
            FROM moduli_template
            WHERE id = ?
        `).run(req.params.id);

        await registraAudit({

            req,

            azione: "ELIMINAZIONE",

            tabella: "moduli_template",

            recordId: req.params.id,

            prima: vecchio

        });

        res.json({

            messaggio: "Template eliminato"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
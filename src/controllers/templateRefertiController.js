const db = require("../config/db");

// ======================================================
// Helper
// ======================================================

function parseTemplate(template) {

    if (!template) return null;

    try {

        return {

            ...template,

            struttura: JSON.parse(

                template.struttura_json || "{}"

            )

        };

    }

    catch (err) {

        console.error(

            "Errore parsing template:",

            err

        );

        return {

            ...template,

            struttura: {

                titolo: "",

                sezioni: []

            }

        };

    }

}

// ======================================================
// ELENCO TEMPLATE
// ======================================================

exports.getAllTemplates = (req, res) => {

    try {

        const templates = db.prepare(`

            SELECT

                id,

                nome,

                specialita_id,

                versione,

                attivo,

                struttura_json

            FROM template_referti

            ORDER BY nome

        `).all();

        const risultato = templates.map(

            t => ({

                ...t,

                struttura: (() => {

                    try {

                        return JSON.parse(

                            t.struttura_json || "{}"

                        );

                    }

                    catch {

                        return {};

                    }

                })()

            })

        );

        res.json(

            risultato

        );

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
// ======================================================
// SINGOLO TEMPLATE
// ======================================================

exports.getTemplate = (req, res) => {

    try {

        const template = db.prepare(`
            SELECT
                id,
                nome,
                specialita_id,
                versione,
                attivo,
                struttura_json
            FROM template_referti
            WHERE id = ?
        `).get(req.params.id);

        if (!template) {

            return res.status(404).json({

                errore: "Template non trovato."

            });

        }

        const risultato = parseTemplate(template);

        res.json(risultato);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
// ======================================================
// CREA TEMPLATE
// ======================================================

exports.createTemplate = (req, res) => {

    try {

        const {

            nome,
            specialita_id,
            versione,
            attivo,
            struttura,
            struttura_json

        } = req.body;

        if (!nome) {

            return res.status(400).json({

                errore: "Il nome del template è obbligatorio."

            });

        }

        const json = struttura_json ||

            JSON.stringify(

                struttura || {

                    titolo: nome,

                    sezioni: []

                },

                null,

                2

            );

        const result = db.prepare(`
            INSERT INTO template_referti
            (
                nome,
                specialita_id,
                versione,
                attivo,
                struttura_json
            )
            VALUES
            (?,?,?,?,?)
        `).run(

            nome,

            specialita_id || null,

            versione || 1,

            attivo ?? 1,

            json

        );

        const template = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(

            parseTemplate(template)

        );

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
// ======================================================
// AGGIORNA TEMPLATE
// ======================================================

exports.updateTemplate = (req, res) => {

    try {

        const {

            nome,
            specialita_id,
            versione,
            attivo,
            struttura,
            struttura_json

        } = req.body;

        const esistente = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(req.params.id);

        if (!esistente) {

            return res.status(404).json({

                errore: "Template non trovato."

            });

        }

        const json = struttura_json ||

            JSON.stringify(

                struttura || {

                    titolo: nome,

                    sezioni: []

                },

                null,

                2

            );

        db.prepare(`
            UPDATE template_referti
            SET

                nome = ?,

                specialita_id = ?,

                versione = ?,

                attivo = ?,

                struttura_json = ?

            WHERE id = ?
        `).run(

            nome,

            specialita_id || null,

            versione || 1,

            attivo ?? 1,

            json,

            req.params.id

        );

        const aggiornato = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(req.params.id);

        res.json(

            parseTemplate(aggiornato)

        );

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
// ======================================================
// ELIMINA TEMPLATE
// ======================================================

exports.deleteTemplate = (req, res) => {

    try {

        const template = db.prepare(`
            SELECT id
            FROM template_referti
            WHERE id = ?
        `).get(req.params.id);

        if (!template) {

            return res.status(404).json({

                errore: "Template non trovato."

            });

        }

        db.prepare(`
            DELETE
            FROM template_referti
            WHERE id = ?
        `).run(req.params.id);

        res.json({

            messaggio: "Template eliminato."

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
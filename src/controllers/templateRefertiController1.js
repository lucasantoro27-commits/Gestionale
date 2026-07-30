const db = require("../config/db");

// ==========================================
// TEMPLATE
// ==========================================

// Elenco template
exports.getAllTemplates = (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT *
            FROM template_referti
            ORDER BY specialita_id, nome
        `).all();

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Template con campi
exports.getTemplate = (req, res) => {

    try {

        const template = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(req.params.id);

        if (!template) {

            return res.status(404).json({
                errore: "Template non trovato"
            });

        }

     const template = db.prepare(`
    SELECT *
    FROM template_referti
    WHERE id=?
`).get(req.params.id);

res.json({

    ...template,

    struttura: JSON.parse(

        template.struttura_json || "{}"

    )

});

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Nuovo template
exports.createTemplate = (req, res) => {

    try {

        const {

            nome,

            specialita_id

        } = req.body;

        const result = db.prepare(`
          INSERT INTO template_referti
(
    nome,
    struttura_json,
    versione,
    attivo,
    specialita_id
)
            VALUES
            (?,?)
        `).run(

            nome,

            specialita_id || ""

        );

        const nuovo = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuovo);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Modifica template
exports.updateTemplate = (req, res) => {

    try {

        const {

            nome,

            specialita_id

        } = req.body;

        db.prepare(`
            UPDATE template_referti
            SET

                nome = ?,

                specialita_id = ?

            WHERE id = ?
        `).run(

            nome,

            specialita_id,

            req.params.id

        );

        const aggiornato = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(req.params.id);

        res.json(aggiornato);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Elimina template
exports.deleteTemplate = (req, res) => {

    try {

        db.prepare(`
            DELETE
            FROM template_referti
            WHERE id = ?
        `).run(req.params.id);

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

// ==========================================
// CAMPI
// ==========================================

// Elenco campi
exports.getCampi = (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT *
            FROM template_referti_campi
            WHERE template_id = ?
            ORDER BY ordine
        `).all(req.params.id);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Nuovo campo
exports.createCampo = (req, res) => {

    try {

        const {

            ordine,

            label,

            nome,

            tipo,

            obbligatorio,

            placeholder,

            opzioni,

            valore_default,

            larghezza

        } = req.body;

        const result = db.prepare(`
            INSERT INTO template_referti_campi
            (

                template_id,

                ordine,

                label,

                nome,

                tipo,

                obbligatorio,

                placeholder,

                opzioni,

                valore_default,

                larghezza

            )
            VALUES
            (?,?,?,?,?,?,?,?,?,?)
        `).run(

            req.params.id,

            ordine || 0,

            label,

            nome,

            tipo,

            obbligatorio ? 1 : 0,

            placeholder || "",

            opzioni
                ? JSON.stringify(opzioni)
                : null,

            valore_default || "",

            larghezza || 12

        );

        const nuovo = db.prepare(`
            SELECT *
            FROM template_referti_campi
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuovo);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Modifica campo
exports.updateCampo = (req, res) => {

    try {

        const {

            ordine,

            label,

            nome,

            tipo,

            obbligatorio,

            placeholder,

            opzioni,

            valore_default,

            larghezza

        } = req.body;

        db.prepare(`
            UPDATE template_referti_campi
            SET

                ordine = ?,

                label = ?,

                nome = ?,

                tipo = ?,

                obbligatorio = ?,

                placeholder = ?,

                opzioni = ?,

                valore_default = ?,

                larghezza = ?

            WHERE id = ?
        `).run(

            ordine,

            label,

            nome,

            tipo,

            obbligatorio ? 1 : 0,

            placeholder,

            opzioni
                ? JSON.stringify(opzioni)
                : null,

            valore_default,

            larghezza,

            req.params.campoId

        );

        const aggiornato = db.prepare(`
            SELECT *
            FROM template_referti_campi
            WHERE id = ?
        `).get(req.params.campoId);

        res.json(aggiornato);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// Elimina campo
exports.deleteCampo = (req, res) => {

    try {

        db.prepare(`
            DELETE
            FROM template_referti_campi
            WHERE id = ?
        `).run(req.params.campoId);

        res.json({

            messaggio: "Campo eliminato"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
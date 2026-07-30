const db = require("../config/db");
const RefertoPdf = require("../pdf/RefertoPdf");

// ==========================================
// Helper
// ==========================================

function parseTemplate(template) {
    if (!template) return null;

    try {
        return {
            ...template,
            struttura: JSON.parse(template.struttura_json || "{}")
        };
    } catch (err) {
        console.error("Errore parsing template:", err);
        return {
            ...template,
            struttura: {}
        };
    }
}

// ==========================================
// ELENCO REFERTI
// ==========================================

exports.getAll = (req, res) => {
    try {

        const rows = db.prepare(`
            SELECT
                r.id,
                r.created_at,
                r.firmato_il,

                p.nome,
                p.cognome,

                pr.data,
                pr.id AS prestazione_id,

                pc.descrizione AS prestazione,

                t.id AS template_id,
                t.nome AS template_nome

            FROM referti r

            INNER JOIN prestazioni pr
                ON pr.id = r.prestazione_id

            INNER JOIN pazienti p
                ON p.id = pr.paziente_id

            INNER JOIN prestazioni_catalogo pc
                ON pc.id = pr.prestazione_catalogo_id

            LEFT JOIN template_referti t
                ON t.id = r.template_id

            ORDER BY pr.data DESC, r.id DESC
        `).all();

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }
};
// ==========================================
// DATI PER NUOVO REFERTO
// ==========================================

exports.getNuovoReferto = (req, res) => {

    try {

        const prestazione = db.prepare(`
            SELECT

                pr.id,
                pr.data,
                pr.note,

                pa.id AS paziente_id,
                pa.nome,
                pa.cognome,
                pa.codice_fiscale,
                pa.data_nascita,
                pa.sesso,

                pc.id AS prestazione_catalogo_id,
                pc.descrizione,
                pc.template_referto_id

            FROM prestazioni pr

            INNER JOIN pazienti pa
                ON pa.id = pr.paziente_id

            INNER JOIN prestazioni_catalogo pc
                ON pc.id = pr.prestazione_catalogo_id

            WHERE pr.id = ?
        `).get(req.params.prestazioneId);

        

        if (!prestazione) {

            return res.status(404).json({
                errore: "Prestazione non trovata"
            });

        }

        if (!prestazione.template_referto_id) {

            return res.status(400).json({
                errore: "Alla prestazione non è associato alcun template."
            });

        }
        

        const template = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
              AND attivo = 1
        `).get(prestazione.template_referto_id);

        if (!template) {

            return res.status(404).json({
                errore: "Template non trovato."
            });

        }

        const templateCompleto = parseTemplate(template);

        res.json({

            prestazione,

            template: templateCompleto,

            struttura: templateCompleto.struttura

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
// ==========================================
// SINGOLO REFERTO
// ==========================================

exports.getOne = (req, res) => {

    try {

        const referto = db.prepare(`
            SELECT

                r.*,

                pr.id AS prestazione_id,
                pr.data,
                pr.note,

                pa.id AS paziente_id,
                pa.nome,
                pa.cognome,
                pa.codice_fiscale,
                pa.data_nascita,
                pa.sesso,

                pc.id AS prestazione_catalogo_id,
                pc.descrizione,

                t.id AS template_id,
                t.nome AS template_nome,
                t.struttura_json,
                t.versione

            FROM referti r

            INNER JOIN prestazioni pr
                ON pr.id = r.prestazione_id

            INNER JOIN pazienti pa
                ON pa.id = pr.paziente_id

            INNER JOIN prestazioni_catalogo pc
                ON pc.id = pr.prestazione_catalogo_id

            LEFT JOIN template_referti t
                ON t.id = r.template_id

            WHERE r.id = ?
        `).get(req.params.id);

        if (!referto) {

            return res.status(404).json({
                errore: "Referto non trovato"
            });

        }

        const template = parseTemplate({

            id: referto.template_id,
            nome: referto.template_nome,
            struttura_json: referto.struttura_json,
            versione: referto.versione

        });

        let dati = {};

        try {

            dati = JSON.parse(referto.dati_json || "{}");

        }

        catch {

            dati = {};

        }

        res.json({

            referto: {

                id: referto.id,
                created_at: referto.created_at,
                firmato_da: referto.firmato_da,
                firmato_il: referto.firmato_il

            },

            prestazione: {

                id: referto.prestazione_id,
                data: referto.data,
                note: referto.note,

                paziente_id: referto.paziente_id,

                nome: referto.nome,
                cognome: referto.cognome,
                codice_fiscale: referto.codice_fiscale,
                data_nascita: referto.data_nascita,
                sesso: referto.sesso,

                descrizione: referto.descrizione

            },

            template,

            struttura: template.struttura,

            dati

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
// ==========================================
// CREA REFERTO
// ==========================================

exports.create = (req, res) => {

    try {

        const {
    prestazione_id,
    paziente_id,
    dati_json
} = req.body;

        if (!prestazione_id)
            return res.status(400).json({ errore: "Prestazione mancante." });

        if (!paziente_id)
            return res.status(400).json({ errore: "Paziente mancante." });
        
        const prestazione = db.prepare(`
    SELECT
        pc.template_referto_id
    FROM prestazioni p
    INNER JOIN prestazioni_catalogo pc
        ON pc.id = p.prestazione_catalogo_id
    WHERE p.id = ?
`).get(prestazione_id);

if (!prestazione?.template_referto_id) {
    return res.status(400).json({
        errore: "Nessun template associato alla prestazione."
    });
}

const template_id = prestazione.template_referto_id;

        const template = db.prepare(`
            SELECT id
            FROM template_referti
            WHERE id=?
              AND attivo=1
        `).get(template_id);

        if (!template) {

            return res.status(404).json({
                errore: "Template non trovato."
            });

        }

        const result = db.prepare(`
            INSERT INTO referti
            (
                prestazione_id,
                paziente_id,
                template_id,
                dati_json
            )
            VALUES
            (?,?,?,?)
        `).run(

            prestazione_id,
            paziente_id,
            template_id,
            JSON.stringify(dati_json || {})

        );

        res.status(201).json({

            id: result.lastInsertRowid,
            messaggio: "Referto creato"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ==========================================
// AGGIORNA REFERTO
// ==========================================

exports.update = (req, res) => {

    try {

        const {
            dati_json,
            firmato_da,
            firmato_il
        } = req.body;

        const referto = db.prepare(`
            SELECT id
            FROM referti
            WHERE id=?
        `).get(req.params.id);

        if (!referto) {

            return res.status(404).json({

                errore: "Referto non trovato."

            });

        }

        db.prepare(`
            UPDATE referti
            SET

                dati_json=?,
                firmato_da=?,
                firmato_il=?

            WHERE id=?
        `).run(

            JSON.stringify(dati_json || {}),

            firmato_da || null,
            firmato_il || null,

            req.params.id

        );

        res.json({

            messaggio: "Referto aggiornato"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ==========================================
// DOWNLOAD PDF
// ==========================================

exports.downloadPdf = async (req, res) => {

    try {

        const referto = db.prepare(`
            SELECT *
            FROM referti
            WHERE id = ?
        `).get(req.params.id);

        if (!referto) {
            return res.status(404).json({
                errore: "Referto non trovato"
            });
        }

        const prestazione = db.prepare(`
            SELECT

                pr.*,

                pa.nome,
                pa.cognome,
                pa.codice_fiscale,
                pa.data_nascita,

                pc.descrizione

            FROM prestazioni pr

            INNER JOIN pazienti pa
                ON pa.id = pr.paziente_id

            INNER JOIN prestazioni_catalogo pc
                ON pc.id = pr.prestazione_catalogo_id

            WHERE pr.id = ?
        `).get(referto.prestazione_id);

        if (!prestazione) {
    return res.status(404).json({
        errore: "Prestazione non trovata"
    });
}

        const template = db.prepare(`
            SELECT *
            FROM template_referti
            WHERE id = ?
        `).get(referto.template_id);

        if (!template) {
    return res.status(404).json({
        errore: "Template non trovato"
    });
}

       let struttura = {};
let dati = {};

try {
    struttura = JSON.parse(template.struttura_json || "{}");
} catch (err) {
    console.error("Errore parsing struttura:", err);
}

try {
    dati = JSON.parse(referto.dati_json || "{}");
} catch (err) {
    console.error("Errore parsing dati:", err);
}

const studio = db.prepare(`
    SELECT *
    FROM impostazioni_studio
    LIMIT 1
`).get();
const pdf = await RefertoPdf.genera({
    studio,
    template,
    struttura,
    prestazione,
    dati
});

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `inline; filename=referto_${referto.id}.pdf`
        );

        res.end(pdf);

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ==========================================
// FIRMA REFERTO
// ==========================================

exports.firmaReferto = (req, res) => {

    try {

        const result = db.prepare(`
            UPDATE referti
            SET
                firmato = 1,
                firmato_da = ?,
                firmato_il = CURRENT_TIMESTAMP,
                data_firma = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(

            req.user.id,
            req.params.id

        );

        if (result.changes === 0) {

            return res.status(404).json({
                errore: "Referto non trovato."
            });

        }

        res.json({
            ok: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ==========================================
// ELIMINA REFERTO
// ==========================================

exports.remove = (req, res) => {

    try {

        const result = db.prepare(`
            DELETE
            FROM referti
            WHERE id=?
        `).run(req.params.id);

        if (result.changes === 0) {

            return res.status(404).json({

                errore: "Referto non trovato."

            });

        }

        res.json({

            messaggio: "Referto eliminato"

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }


};
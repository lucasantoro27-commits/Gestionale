const db = require("../config/db");
const registraAudit = require("../utils/auditMiddleware");
const fs = require("fs");
const { generaPdfConsenso } = require("../services/pdfConsensoService");

// ======================================================
// SOSTITUZIONE VARIABILI TEMPLATE
// ======================================================

function renderTemplate(html, dati) {

    if (!html) return "";

    return html.replace(/\{\{(.*?)\}\}/g, (_, key) => {

        const valore = dati[key.trim()];

        return valore ?? "";

    });

}

// ======================================================
// TEMPLATE DELLA PRESTAZIONE
// GET /api/consensi/prestazione/:id
// ======================================================

exports.getByPrestazione = async (req, res) => {

    try {

        const prestazione = db.prepare(`
            SELECT

                p.*,

                pa.nome,
                pa.cognome,
                pa.codice_fiscale,
                pa.data_nascita,
                pa.indirizzo,
                pa.telefono,
                pa.email,

                pc.descrizione AS nome_prestazione,
                pc.template_modulo_id,

                o.nome AS operatore_nome,
                o.cognome AS operatore_cognome

            FROM prestazioni p

            INNER JOIN pazienti pa
                ON pa.id = p.paziente_id

            INNER JOIN prestazioni_catalogo pc
                ON pc.id = p.prestazione_catalogo_id

            LEFT JOIN operatori o
                ON o.id = p.operatore_id

            WHERE p.id = ?

        `).get(req.params.id);

        if (!prestazione) {

            return res.status(404).json({

                errore: "Prestazione non trovata"

            });

        }

        if (!prestazione.template_modulo_id) {

            return res.json({

                template: null

            });

        }

        const template = db.prepare(`
            SELECT *
            FROM moduli_template
            WHERE id=?
        `).get(prestazione.template_modulo_id);

        if (!template) {

            return res.status(404).json({

                errore: "Template non trovato"

            });

        }

        const html = renderTemplate(

            template.contenuto_html,

            {

                nome: prestazione.nome,

                cognome: prestazione.cognome,

                nome_completo:
                    prestazione.nome + " " + prestazione.cognome,

                codice_fiscale:
                    prestazione.codice_fiscale,

                data_nascita:
                    prestazione.data_nascita,

                indirizzo:
                    prestazione.indirizzo,

                telefono:
                    prestazione.telefono,

                email:
                    prestazione.email,

                prestazione:
                    prestazione.nome_prestazione,

                operatore:
                    prestazione.operatore_nome
                        ? prestazione.operatore_nome +
                          " " +
                          prestazione.operatore_cognome
                        : "",

                oggi:
                    new Date().toLocaleDateString("it-IT")

            }

        );

        res.json({

            template,

            html,

            paziente: {

                id: prestazione.paziente_id,

                nome: prestazione.nome,

                cognome: prestazione.cognome

            },

            prestazione

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ======================================================
// SALVATAGGIO CONSENSO
// POST /api/consensi
// ======================================================

exports.create = async (req, res) => {

    try {

        const {

            template_id,
            paziente_id,
            prestazione_id,
            operatore_id,
            html_generato,
            firma_paziente,
            firma_operatore,
            note

        } = req.body;

        const template = db.prepare(`
            SELECT *
            FROM moduli_template
            WHERE id=?
        `).get(template_id);

        if (!template) {

            return res.status(404).json({

                errore: "Template inesistente"

            });

        }

        const result = db.prepare(`

            INSERT INTO moduli_firmati(

                template_id,
                paziente_id,
                prestazione_id,
                operatore_id,
                versione,
                html_generato,
                firma_paziente,
                firma_operatore,
                note

            )

            VALUES (?,?,?,?,?,?,?,?,?)

        `).run(

            template_id,
            paziente_id,
            prestazione_id,
            operatore_id,
            template.versione,
            html_generato,
            firma_paziente,
            firma_operatore,
            note || ""

        );

        const consensoId = result.lastInsertRowid;

        const pdf = await generaPdfConsenso({

            consensoId,

            paziente: paziente_id,

            template,

            html: html_generato,

            firmaPaziente: firma_paziente,

            firmaOperatore: firma_operatore

        });

        const stat = fs.statSync(pdf.filePath);

        db.prepare(`

            INSERT INTO documenti(

                paziente_id,

                prestazione_id,

                nome_file,

                percorso,

                tipo,

                mime_type,

                dimensione,

                caricato_da

            )

            VALUES (?,?,?,?,?,?,?,?)

        `).run(

            paziente_id,

            prestazione_id,

            pdf.fileName,

            pdf.filePath,

            "CONSENSO",

            "application/pdf",

            stat.size,

            operatore_id

        );

        db.prepare(`

            UPDATE moduli_firmati

            SET pdf=?

            WHERE id=?

        `).run(

            pdf.filePath,

            consensoId

        );

        await registraAudit({

            req,

            azione:"INSERIMENTO",

            tabella:"moduli_firmati",

            recordId:consensoId,

            dopo:req.body

        });

        res.status(201).json({

            id:consensoId,

            pdf:pdf.fileName,

            messaggio:"Consenso salvato"

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            errore:err.message

        });

    }

};

// ======================================================
// DETTAGLIO CONSENSO
// GET /api/consensi/:id
// ======================================================

exports.getOne = async (req, res) => {

    try {

        const row = db.prepare(`

            SELECT

    mf.*,

    mt.titolo,

    p.data,

                pa.nome AS paziente_nome,
                pa.cognome AS paziente_cognome,

                pc.descrizione AS prestazione,

                o.nome || ' ' || o.cognome AS operatore

            FROM moduli_firmati mf

            INNER JOIN moduli_template mt
                ON mt.id = mf.template_id

            INNER JOIN prestazioni p
                ON p.id = mf.prestazione_id

            INNER JOIN pazienti pa
                ON pa.id = mf.paziente_id

            LEFT JOIN prestazioni_catalogo pc
                ON pc.id = p.prestazione_catalogo_id

            LEFT JOIN operatori o
                ON o.id = mf.operatore_id

            WHERE mf.id = ?

        `).get(req.params.id);

        if (!row) {

            return res.status(404).json({
                errore: "Consenso non trovato"
            });

        }

        res.json(row);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
// ======================================================
// CONSENSI DEL PAZIENTE
// GET /api/consensi/paziente/:id
// ======================================================

exports.getByPaziente = async (req, res) => {

    try {

        const rows = db.prepare(`

            SELECT

                mf.*,

                mt.titolo

            FROM moduli_firmati mf

            INNER JOIN moduli_template mt

                ON mt.id = mf.template_id

            WHERE mf.paziente_id = ?

            ORDER BY mf.data_firma DESC

        `).all(req.params.id);

        res.json(rows);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};
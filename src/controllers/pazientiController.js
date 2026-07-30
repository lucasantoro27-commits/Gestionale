const db = require("../config/db");
const registraAudit = require("../utils/auditMiddleware");



exports.search = (req, res) => {
    try {

        const q = `%${req.query.q || ""}%`;

        const rows = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE attivo = 1
            AND (
                nome LIKE ?
                OR cognome LIKE ?
                OR codice_fiscale LIKE ?
                OR telefono LIKE ?
            )
            ORDER BY cognome, nome
            LIMIT 50
        `).all(q, q, q, q);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }
};
// =======================================
// Elenco pazienti
// =======================================
exports.getAll = (req, res) => {

    try {

        const pazienti = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE attivo = 1
            ORDER BY cognome, nome
        `).all();

        res.json(pazienti);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// =======================================
// Singolo paziente
// =======================================
exports.getOne = (req, res) => {

    try {

        const paziente = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE id = ?
        `).get(req.params.id);

        if (!paziente) {

            return res.status(404).json({
                errore: "Paziente non trovato"
            });

        }

        res.json(paziente);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// =======================================
// Nuovo paziente
// =======================================
exports.create = async (req, res) => {

    try {

        const {

            nome,
            cognome,
            sesso,
            data_nascita,
            codice_fiscale,
            comune_nascita,
            indirizzo,
            cap,
            comune_residenza,
            provincia_residenza,
            telefono,
            email,
            medico_curante,
            contatto_emergenza,
            telefono_emergenza,
            note

        } = req.body;

        const stmt = db.prepare(`
            INSERT INTO pazienti
            (
                nome,
                cognome,
                sesso,
                data_nascita,
                codice_fiscale,
                comune_nascita,
                indirizzo,
                cap,
                comune_residenza,
                provincia_residenza,
                telefono,
                email,
                medico_curante,
                contatto_emergenza,
                telefono_emergenza,
                note
            )
            VALUES
            (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `);

        const result = stmt.run(

            nome,
            cognome,
            sesso,
            data_nascita,
            codice_fiscale,
            comune_nascita,
            indirizzo,
            cap,
            comune_residenza,
            provincia_residenza,
            telefono,
            email,
            medico_curante,
            contatto_emergenza,
            telefono_emergenza,
            note

        );

        const paziente = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE id = ?
        `).get(result.lastInsertRowid);

        await registraAudit({
            req,
            azione: "INSERIMENTO",
            tabella: "pazienti",
            recordId: paziente.id,
            dettagli: [
                {
                    campo: "record",
                    prima: null,
                    dopo: `${paziente.cognome} ${paziente.nome}`
                }
            ]
        });

        res.status(201).json(paziente);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
// =======================================
// Aggiorna paziente
// =======================================
exports.update = async (req, res) => {

    try {

        const {

            nome,
            cognome,
            sesso,
            data_nascita,
            codice_fiscale,
            comune_nascita,
            indirizzo,
            cap,
            comune_residenza,
            provincia_residenza,
            telefono,
            email,
            medico_curante,
            contatto_emergenza,
            telefono_emergenza,
            note

        } = req.body;

        // Leggo il record PRIMA della modifica
        const prima = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE id = ?
        `).get(req.params.id);

        db.prepare(`
            UPDATE pazienti
            SET

                nome=?,
                cognome=?,
                sesso=?,
                data_nascita=?,
                codice_fiscale=?,
                comune_nascita=?,
                indirizzo=?,
                cap=?,
                comune_residenza=?,
                provincia_residenza=?,
                telefono=?,
                email=?,
                medico_curante=?,
                contatto_emergenza=?,
                telefono_emergenza=?,
                note=?

            WHERE id=?
        `).run(

            nome,
            cognome,
            sesso,
            data_nascita,
            codice_fiscale,
            comune_nascita,
            indirizzo,
            cap,
            comune_residenza,
            provincia_residenza,
            telefono,
            email,
            medico_curante,
            contatto_emergenza,
            telefono_emergenza,
            note,
            req.params.id

        );

        // Leggo il record DOPO la modifica
        const paziente = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE id = ?
        `).get(req.params.id);

        // Registro l'audit
        await registraAudit({

            req,

            azione: "MODIFICA",

            tabella: "pazienti",

            recordId: paziente.id,

            prima,

            dopo: paziente

        });

        res.json(paziente);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
// =======================================
// Disattiva paziente
// =======================================
exports.remove = async (req, res) => {

    try {

        // Leggo il record prima della disattivazione
        const prima = db.prepare(`
            SELECT *
            FROM pazienti
            WHERE id = ?
        `).get(req.params.id);

        if (!prima) {

            return res.status(404).json({
                errore: "Paziente non trovato"
            });

        }

        db.prepare(`
            UPDATE pazienti
            SET attivo = 0
            WHERE id = ?
        `).run(req.params.id);

        // Registro l'audit
        await registraAudit({

            req,

            azione: "DISATTIVAZIONE",

            tabella: "pazienti",

            recordId: req.params.id,

            prima,

            dopo: {
                ...prima,
                attivo: 0
            }

        });

        res.json({
            messaggio: "Paziente disattivato"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
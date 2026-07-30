const db = require("../config/db");

// ===============================
// ELENCO
// ===============================

exports.getAll = (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT *
            FROM specialita
            ORDER BY nome
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
// DETTAGLIO
// ===============================

exports.getOne = (req, res) => {

    try {

        const row = db.prepare(`
            SELECT *
            FROM specialita
            WHERE id = ?
        `).get(req.params.id);

        if (!row) {

            return res.status(404).json({
                errore: "Specialità non trovata"
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
// CREA
// ===============================

exports.create = (req, res) => {

    try {

        const {

            nome,
            icona,
            colore,
            attiva

        } = req.body;

        const result = db.prepare(`
            INSERT INTO specialita
            (
                nome,
                icona,
                colore,
                attiva
            )
            VALUES
            (?,?,?,?)
        `).run(

            nome,
            icona || "",
            colore || "#2563eb",
            attiva ?? 1

        );

        res.status(201).json({

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
// MODIFICA
// ===============================

exports.update = (req, res) => {

    try {

        const {

            nome,
            icona,
            colore,
            attiva

        } = req.body;

        db.prepare(`
            UPDATE specialita
            SET
                nome=?,
                icona=?,
                colore=?,
                attiva=?
            WHERE id=?
        `).run(

            nome,
            icona,
            colore,
            attiva,
            req.params.id

        );

        res.json({

            messaggio: "Specialità aggiornata"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===============================
// ELIMINA
// ===============================

exports.remove = (req, res) => {

    try {

        db.prepare(`
            DELETE
            FROM specialita
            WHERE id=?
        `).run(req.params.id);

        res.json({

            messaggio: "Specialità eliminata"

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
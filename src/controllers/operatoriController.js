const db = require("../config/db");

// ===========================
// ELENCO OPERATORI
// ===========================

const getAll = (req, res) => {

    try {

        const operatori = db.prepare(`
            SELECT *
            FROM operatori
            ORDER BY cognome, nome
        `).all();

        res.json(operatori);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===========================
// DETTAGLIO
// ===========================

const getOne = (req, res) => {

    try {

        const operatore = db.prepare(`
            SELECT *
            FROM operatori
            WHERE id = ?
        `).get(req.params.id);

        if (!operatore) {

            return res.status(404).json({
                errore: "Operatore non trovato"
            });

        }

        res.json(operatore);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===========================
// NUOVO
// ===========================

const create = (req, res) => {

    try {

        const {
    nome,
    cognome,
    professione,
    telefono,
    email,
    specializzazione
} = req.body;

        const result = db.prepare(`
    INSERT INTO operatori (
        nome,
        cognome,
        professione,
        telefono,
        email,
        specializzazione
    )
    VALUES (?,?,?,?,?,?)
`).run(
    nome,
    cognome,
    professione,
    telefono || "",
    email || "",
    specializzazione || ""
);

        const nuovo = db.prepare(`
            SELECT *
            FROM operatori
            WHERE id=?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuovo);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===========================
// MODIFICA
// ===========================

const update = (req, res) => {

    try {

        const {

            nome,

            cognome,

            telefono,

            email,

            specializzazione

        } = req.body;

        db.prepare(`
            UPDATE operatori
            SET
                nome=?,
                cognome=?,
                telefono=?,
                email=?,
                specializzazione=?
            WHERE id=?
        `).run(

            nome,

            cognome,

            telefono,

            email,

            specializzazione,

            req.params.id

        );

        const aggiornato = db.prepare(`
            SELECT *
            FROM operatori
            WHERE id=?
        `).get(req.params.id);

        res.json(aggiornato);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ===========================
// ELIMINA
// ===========================

const remove = (req, res) => {

    try {

        db.prepare(`
            DELETE FROM operatori
            WHERE id=?
        `).run(req.params.id);

        res.json({
            messaggio: "Operatore eliminato"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

module.exports = {

    getAll,

    getOne,

    create,

    update,

    remove

};
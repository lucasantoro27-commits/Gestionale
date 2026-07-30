const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ===========================
// ELENCO UTENTI
// ===========================

const getAll = (req, res) => {

    try {

        const utenti = db.prepare(`
            SELECT

                u.id,
                u.username,
                u.ruolo,
                u.attivo,
                u.operatore_id,

                o.nome,
                o.cognome,
                o.professione

            FROM utenti u

            LEFT JOIN operatori o

                ON o.id = u.operatore_id

            ORDER BY

                o.cognome,
                o.nome,
                u.username
        `).all();

        res.json(utenti);

    }

    catch (err) {

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

        const utente = db.prepare(`
            SELECT *
            FROM utenti
            WHERE id = ?
        `).get(req.params.id);

        if (!utente) {

            return res.status(404).json({

                errore: "Utente non trovato"

            });

        }

        res.json(utente);

    }

    catch (err) {

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

            username,
            password,
            ruolo,
            operatore_id

        } = req.body;

        if (!username || !password || !ruolo) {

            return res.status(400).json({

                errore: "Compilare tutti i campi obbligatori"

            });

        }

        const esistente = db.prepare(`
            SELECT id
            FROM utenti
            WHERE username = ?
        `).get(username);

        if (esistente) {

            return res.status(400).json({

                errore: "Username già esistente"

            });

        }

        const hash = bcrypt.hashSync(password, 10);

        const result = db.prepare(`
            INSERT INTO utenti
            (
                username,
                password_hash,
                ruolo,
                operatore_id,
                attivo
            )
            VALUES
            (?,?,?,?,1)
        `).run(

            username,

            hash,

            ruolo,

            operatore_id || null

        );

        const nuovo = db.prepare(`
            SELECT
                id,
                username,
                ruolo,
                operatore_id,
                attivo
            FROM utenti
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuovo);

    }

    catch (err) {

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

            username,
            password,
            ruolo,
            operatore_id,
            attivo

        } = req.body;

        if (password && password.trim() !== "") {

            const hash = bcrypt.hashSync(password, 10);

            db.prepare(`
                UPDATE utenti
                SET
                    username = ?,
                    password_hash = ?,
                    ruolo = ?,
                    operatore_id = ?,
                    attivo = ?
                WHERE id = ?
            `).run(

                username,

                hash,

                ruolo,

                operatore_id || null,

                attivo,

                req.params.id

            );

        }

        else {

            db.prepare(`
                UPDATE utenti
                SET
                    username = ?,
                    ruolo = ?,
                    operatore_id = ?,
                    attivo = ?
                WHERE id = ?
            `).run(

                username,

                ruolo,

                operatore_id || null,

                attivo,

                req.params.id

            );

        }

        const aggiornato = db.prepare(`
            SELECT
                id,
                username,
                ruolo,
                operatore_id,
                attivo
            FROM utenti
            WHERE id = ?
        `).get(req.params.id);

        res.json(aggiornato);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ===========================
// DISATTIVA
// ===========================

const remove = (req, res) => {

    try {

        db.prepare(`
            UPDATE utenti
            SET attivo = 0
            WHERE id = ?
        `).run(req.params.id);

        res.json({

            messaggio: "Utente disattivato"

        });

    }

    catch (err) {

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
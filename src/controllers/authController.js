const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==============================
// LOGIN
// ==============================

exports.login = (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {

        return res.status(400).json({
            errore: "Username e password obbligatori"
        });

    }

    try {

        const utente = db.prepare(`
            SELECT *
            FROM utenti
            WHERE username = ?
            AND attivo = 1
        `).get(username);

        if (!utente) {

            return res.status(401).json({
                errore: "Credenziali non valide"
            });

        }

        const valida = bcrypt.compareSync(
            password,
            utente.password_hash
        );

        if (!valida) {

            return res.status(401).json({
                errore: "Credenziali non valide"
            });

        }

        const token = jwt.sign(

            {

                id: utente.id,

                username: utente.username,

                ruolo: utente.ruolo,

                operatore_id: utente.operatore_id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "12h"

            }

        );

        res.json({

            token,

            utente: {

                id: utente.id,

                username: utente.username,

                ruolo: utente.ruolo,

                operatore_id: utente.operatore_id

            }

        });

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// ==============================
// UTENTE LOGGATO
// ==============================

exports.me = (req, res) => {

    try {

        const utente = db.prepare(`
            SELECT

                id,

                username,

                ruolo,

                operatore_id,

                attivo

            FROM utenti

            WHERE id = ?

        `).get(req.user.id);

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
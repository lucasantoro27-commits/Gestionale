const express = require("express");
const router = express.Router();
const db = require("../database");

/*
 * Elenco note cliniche di un paziente
 */
router.get("/paziente/:id", (req, res) => {

    try {

        const diario = db.prepare(`
            SELECT *
            FROM diario_clinico
            WHERE paziente_id = ?
            ORDER BY data DESC
        `).all(req.params.id);

        res.json(diario);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


/*
 * Dettaglio nota
 */
router.get("/:id", (req, res) => {

    try {

        const nota = db.prepare(`
            SELECT *
            FROM diario_clinico
            WHERE id = ?
        `).get(req.params.id);

        if (!nota) {

            return res.status(404).json({
                error: "Nota non trovata"
            });

        }

        res.json(nota);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


/*
 * Nuova nota
 */
router.post("/", (req, res) => {

    try {

        const nota = req.body;

        const result = db.prepare(`
            INSERT INTO diario_clinico(

                paziente_id,
                data,
                categoria,
                titolo,
                descrizione,
                operatore,
                created_at

            )

            VALUES(

                @paziente_id,
                @data,
                @categoria,
                @titolo,
                @descrizione,
                @operatore,
                datetime('now')

            )
        `).run({

            paziente_id: nota.paziente_id,

            data: nota.data,

            categoria: nota.categoria,

            titolo: nota.titolo,

            descrizione: nota.descrizione,

            operatore: nota.operatore

        });

        const nuovaNota = db.prepare(`
            SELECT *
            FROM diario_clinico
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuovaNota);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


/*
 * Modifica nota
 */
router.put("/:id", (req, res) => {

    try {

        const nota = req.body;

        db.prepare(`
            UPDATE diario_clinico

            SET

                data = @data,

                categoria = @categoria,

                titolo = @titolo,

                descrizione = @descrizione,

                operatore = @operatore

            WHERE id = @id
        `).run({

            id: req.params.id,

            data: nota.data,

            categoria: nota.categoria,

            titolo: nota.titolo,

            descrizione: nota.descrizione,

            operatore: nota.operatore

        });

        const aggiornata = db.prepare(`
            SELECT *
            FROM diario_clinico
            WHERE id = ?
        `).get(req.params.id);

        res.json(aggiornata);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


/*
 * Eliminazione nota
 */
router.delete("/:id", (req, res) => {

    try {

        db.prepare(`
            DELETE
            FROM diario_clinico
            WHERE id = ?
        `).run(req.params.id);

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});

module.exports = router;
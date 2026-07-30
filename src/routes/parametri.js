const express = require("express");
const router = express.Router();
const db = require("../database");

/**
 * Elenco parametri di un paziente
 */
router.get("/paziente/:id", (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT *
            FROM parametri_vitali
            WHERE paziente_id = ?
            ORDER BY data DESC
        `).all(req.params.id);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: err.message
        });

    }

});


/**
 * Inserimento nuovo parametro
 */
router.post("/", (req, res) => {

    try {

        const dato = req.body;

        const result = db.prepare(`
            INSERT INTO parametri_vitali(

                paziente_id,
                data,

                pressione_sistolica,
                pressione_diastolica,

                frequenza,

                spo2,

                temperatura,

                glicemia,

                peso,

                altezza,

                bmi,

                dolore,

                frequenza_respiratoria,

                note,

                operatore,

                created_at

            )

            VALUES(

                @paziente_id,

                @data,

                @pressione_sistolica,

                @pressione_diastolica,

                @frequenza,

                @spo2,

                @temperatura,

                @glicemia,

                @peso,

                @altezza,

                @bmi,

                @dolore,

                @frequenza_respiratoria,

                @note,

                @operatore,

                datetime('now')

            )
        `).run({

            paziente_id: dato.paziente_id,

            data: dato.data,

            pressione_sistolica: dato.pressione_sistolica,

            pressione_diastolica: dato.pressione_diastolica,

            frequenza: dato.frequenza,

            spo2: dato.spo2,

            temperatura: dato.temperatura,

            glicemia: dato.glicemia,

            peso: dato.peso,

            altezza: dato.altezza,

            bmi: dato.bmi,

            dolore: dato.dolore,

            frequenza_respiratoria: dato.frequenza_respiratoria,

            note: dato.note,

            operatore: dato.operatore

        });

        res.status(201).json({

            success: true,

            id: result.lastInsertRowid

        });

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

});


/**
 * Modifica parametro
 */
router.put("/:id", (req, res) => {

    try {

        const dato = req.body;

        db.prepare(`
            UPDATE parametri_vitali

            SET

                data=@data,

                pressione_sistolica=@pressione_sistolica,

                pressione_diastolica=@pressione_diastolica,

                frequenza=@frequenza,

                spo2=@spo2,

                temperatura=@temperatura,

                glicemia=@glicemia,

                peso=@peso,

                altezza=@altezza,

                bmi=@bmi,

                dolore=@dolore,

                frequenza_respiratoria=@frequenza_respiratoria,

                note=@note,

                operatore=@operatore

            WHERE id=@id
        `).run({

            id: req.params.id,

            ...dato

        });

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


/**
 * Eliminazione parametro
 */
router.delete("/:id", (req, res) => {

    try {

        db.prepare(`
            DELETE
            FROM parametri_vitali
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
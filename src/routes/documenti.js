const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("../database");

const uploadDir = path.join(__dirname, "../uploads/documenti");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, uploadDir);

    },

    filename(req, file, cb) {

        const ext = path.extname(file.originalname);

        const nome = Date.now() + "_" + Math.round(Math.random() * 100000);

        cb(null, nome + ext);

    }

});

const upload = multer({

    storage,

    limits: {

        fileSize: 20 * 1024 * 1024

    }

});



/*
 * Elenco documenti paziente
 */

router.get("/paziente/:id", (req, res) => {

    try {

        const rows = db.prepare(`

            SELECT *

            FROM documenti

            WHERE paziente_id = ?

            ORDER BY created_at DESC

        `).all(req.params.id);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

});



/*
 * Upload documento
 */

router.post(

    "/upload",

    upload.single("file"),

    (req, res) => {

        try {

            if (!req.file) {

                return res.status(400).json({

                    error: "File non presente"

                });

            }

            const body = req.body;

            const result = db.prepare(`

                INSERT INTO documenti(

                    paziente_id,

                    categoria,

                    nome,

                    file,

                    mime_type,

                    dimensione,

                    operatore,

                    created_at

                )

                VALUES(

                    @paziente_id,

                    @categoria,

                    @nome,

                    @file,

                    @mime_type,

                    @dimensione,

                    @operatore,

                    datetime('now')

                )

            `).run({

                paziente_id: body.paziente_id,

                categoria: body.categoria || "Documento",

                nome: body.nome || req.file.originalname,

                file: req.file.filename,

                mime_type: req.file.mimetype,

                dimensione: req.file.size,

                operatore: body.operatore || ""

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

    }

);



/*
 * Download / Visualizzazione
 */

router.get("/:id/download", (req, res) => {

    try {

        const doc = db.prepare(`

            SELECT *

            FROM documenti

            WHERE id = ?

        `).get(req.params.id);

        if (!doc) {

            return res.status(404).json({

                error: "Documento non trovato"

            });

        }

        const file = path.join(uploadDir, doc.file);

        res.download(file, doc.nome);

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

});



/*
 * Anteprima
 */

router.get("/:id/view", (req, res) => {

    try {

        const doc = db.prepare(`

            SELECT *

            FROM documenti

            WHERE id=?

        `).get(req.params.id);

        if (!doc) {

            return res.sendStatus(404);

        }

        res.sendFile(

            path.join(uploadDir, doc.file)

        );

    } catch (err) {

        console.error(err);

        res.status(500).json({

            error: err.message

        });

    }

});



/*
 * Eliminazione documento
 */

router.delete("/:id", (req, res) => {

    try {

        const doc = db.prepare(`

            SELECT *

            FROM documenti

            WHERE id=?

        `).get(req.params.id);

        if (!doc) {

            return res.sendStatus(404);

        }

        const file = path.join(uploadDir, doc.file);

        if (fs.existsSync(file)) {

            fs.unlinkSync(file);

        }

        db.prepare(`

            DELETE

            FROM documenti

            WHERE id=?

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
const db = require("../config/db");

exports.getAll = (req, res) => {
    try {

        const rows = db.prepare(`
            SELECT *
            FROM audit_log
            ORDER BY datetime(data_ora) DESC
            LIMIT 1000
        `).all();

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }
};

exports.getOne = (req, res) => {

    try {

        const row = db.prepare(`
            SELECT *
            FROM audit_log
            WHERE id = ?
        `).get(req.params.id);

        if (!row) {
            return res.status(404).json({
                errore: "Audit non trovato"
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
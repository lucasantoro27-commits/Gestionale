const db = require("../config/db");

// =======================================
// ELENCO PRESTAZIONI ESEGUITE
// =======================================

exports.getAll = (req, res) => {

    try {

        const rows = db.prepare(`
            SELECT
                p.*,
                pa.nome,
                pa.cognome,
                pc.descrizione AS prestazione,
                o.nome || ' ' || o.cognome AS operatore
            FROM prestazioni p

            LEFT JOIN pazienti pa
                ON pa.id = p.paziente_id

            LEFT JOIN prestazioni_catalogo pc
                ON pc.id = p.prestazione_catalogo_id

            LEFT JOIN operatori o
                ON o.id = p.operatore_id

            ORDER BY p.data DESC
        `).all();

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// =======================================
// PRESTAZIONI DI UN PAZIENTE
// =======================================

exports.getByPaziente = (req, res) => {

    try {

        const rows = db.prepare(`
           SELECT
           p.*,
           pc.descrizione AS prestazione,
           o.nome || ' ' || o.cognome AS operatore,
           r.id AS referto_id,
           mf.id AS consenso_id,
           mf.pdf AS consenso_pdf
            FROM prestazioni p

            LEFT JOIN prestazioni_catalogo pc
                ON pc.id = p.prestazione_catalogo_id

            LEFT JOIN operatori o
                ON o.id = p.operatore_id

            LEFT JOIN referti r
                ON r.prestazione_id = p.id

                LEFT JOIN moduli_firmati mf
    ON mf.prestazione_id = p.id
    
            WHERE p.paziente_id = ?

            ORDER BY p.data DESC
        `).all(req.params.id);

        res.json(rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// =======================================
// SINGOLA PRESTAZIONE
// =======================================

exports.getOne = (req, res) => {

    try {

        const row = db.prepare(`
            SELECT *
            FROM prestazioni
            WHERE id = ?
        `).get(req.params.id);

        if (!row) {

            return res.status(404).json({
                errore: "Prestazione non trovata"
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

// =======================================
// CREA PRESTAZIONE
// =======================================

exports.create = (req, res) => {

    try {

        const {

            paziente_id,
            appuntamento_id,
            prestazione_catalogo_id,
            operatore_id,
            ambulatorio_id,
            data,
            note

        } = req.body;

        const catalogo = db.prepare(`
            SELECT *
            FROM prestazioni_catalogo
            WHERE id = ?
        `).get(prestazione_catalogo_id);

        if (!catalogo) {

            return res.status(404).json({
                errore: "Prestazione catalogo non trovata"
            });

        }

        const result = db.prepare(`
            INSERT INTO prestazioni
            (
                paziente_id,
                appuntamento_id,
                prestazione_catalogo_id,
                operatore_id,
                ambulatorio_id,
                data,
                note,
                descrizione,
                colore_agenda
            )
            VALUES
            (?,?,?,?,?,?,?,?,?)
        `).run(

            paziente_id,
            appuntamento_id,
            prestazione_catalogo_id,
            operatore_id,
            ambulatorio_id,
            data,
            note || "",
            catalogo.descrizione,
            catalogo.colore_agenda

        );

        res.status(201).json({

            id: result.lastInsertRowid

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// =======================================
// MODIFICA
// =======================================

exports.update = (req,res)=>{

    try{

        const {

            note

        } = req.body;

        db.prepare(`
            UPDATE prestazioni
            SET
                note = ?
            WHERE id = ?
        `).run(

            note,

            req.params.id

        );

        res.json({

            messaggio:"Prestazione aggiornata"

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// =======================================
// ELIMINA
// =======================================

exports.remove = (req,res)=>{

    try{

        db.prepare(`
            DELETE
            FROM prestazioni
            WHERE id=?
        `).run(req.params.id);

        res.json({

            messaggio:"Prestazione eliminata"

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};
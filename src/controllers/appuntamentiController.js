const db = require("../config/db");

// =======================================
// ELENCO APPUNTAMENTI
// =======================================

const getAll = (req, res) => {

    try {

        const appuntamenti = db.prepare(`
            SELECT
                a.*,
                p.nome,
                p.cognome,
                pc.descrizione AS prestazione,
                pc.colore_agenda,
                o.nome || ' ' || o.cognome AS operatore
            FROM appuntamenti a
            LEFT JOIN pazienti p
                ON p.id = a.paziente_id
            LEFT JOIN prestazioni_catalogo pc
                ON pc.id = a.prestazione_id
            LEFT JOIN operatori o
                ON o.id = a.operatore_id
            ORDER BY a.data_ora_inizio
        `).all();

        res.json(appuntamenti);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// =======================================
// DETTAGLIO
// =======================================

const getOne = (req, res) => {

    try {

        const appuntamento = db.prepare(`
            SELECT *
            FROM appuntamenti
            WHERE id = ?
        `).get(req.params.id);

        if (!appuntamento) {

            return res.status(404).json({

                errore: "Appuntamento non trovato"

            });

        }

        res.json(appuntamento);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({

            errore: err.message

        });

    }

};

// =======================================
// NUOVO
// =======================================

const create = (req, res) => {

    try {

        console.log("BODY APPUNTAMENTO:");
console.log(req.body);

        const {

            paziente_id,

            operatore_id,

            ambulatorio_id,

            prestazione_id,

            data_ora_inizio,

            data_ora_fine,

            stato,

            note

        } = req.body;

        const data = data_ora_inizio?.substring(0,10);

        const ora = data_ora_inizio?.substring(11,16);

        const result = db.prepare(`
            INSERT INTO appuntamenti
            (
                paziente_id,
                operatore_id,
                ambulatorio_id,
                prestazione_id,
                data,
                ora,
                data_ora_inizio,
                data_ora_fine,
                stato,
                note
            )
            VALUES
            (?,?,?,?,?,?,?,?,?,?)
        `).run(

            paziente_id || null,

            operatore_id || null,

            ambulatorio_id || null,

            prestazione_id || null,

            data,

            ora,

            data_ora_inizio,

            data_ora_fine,

            stato || "Prenotata",

            note || ""

        );

        const nuovo = db.prepare(`
            SELECT *
            FROM appuntamenti
            WHERE id=?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuovo);

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

const update = (req,res)=>{

    try{

        const{

            paziente_id,

            operatore_id,

            ambulatorio_id,

            prestazione_id,

            data_ora_inizio,

            data_ora_fine,

            stato,

            note

        }=req.body;

        const data=data_ora_inizio?.substring(0,10);

        const ora=data_ora_inizio?.substring(11,16);

        db.prepare(`
            UPDATE appuntamenti
            SET
                paziente_id=?,
                operatore_id=?,
                ambulatorio_id=?,
                prestazione_id=?,
                data=?,
                ora=?,
                data_ora_inizio=?,
                data_ora_fine=?,
                stato=?,
                note=?
            WHERE id=?
        `).run(

            paziente_id,

            operatore_id,

            ambulatorio_id,

            prestazione_id,

            data,

            ora,

            data_ora_inizio,

            data_ora_fine,

            stato,

            note,

            req.params.id

        );

        const aggiornato=db.prepare(`
            SELECT *
            FROM appuntamenti
            WHERE id=?
        `).get(req.params.id);

        res.json(aggiornato);

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            errore:err.message

        });

    }

};

// =======================================
// ELIMINA
// =======================================

const remove=(req,res)=>{

    try{

        db.prepare(`
            DELETE
            FROM appuntamenti
            WHERE id=?
        `).run(req.params.id);

        res.json({

            messaggio:"Eliminato"

        });

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            errore:err.message

        });

    }

};

// =======================================
// STORICO PAZIENTE
// =======================================

const getByPaziente=(req,res)=>{

    try{

        const storico=db.prepare(`
            SELECT *
            FROM appuntamenti
            WHERE paziente_id=?
            ORDER BY data_ora_inizio DESC
        `).all(req.params.id);

        res.json(storico);

    }

    catch(err){

        console.error(err);

        res.status(500).json({

            errore:err.message

        });

    }

};

// =======================================
// ESEGUI PRESTAZIONE
// =======================================

const eseguiPrestazione = (req, res) => {

    try {

        const tx = db.transaction(() => {

            console.log("===== DEBUG =====");
console.log("req.params.id =", req.params.id);

const tutti = db.prepare(`
    SELECT id, prestazione_id
    FROM appuntamenti
    ORDER BY id
`).all();

console.table(tutti);

const appuntamento = db.prepare(`
    SELECT *
    FROM appuntamenti
    WHERE id = ?
`).get(req.params.id);

console.log("Appuntamento trovato:", appuntamento);

            if (!appuntamento) {
                throw new Error("Appuntamento non trovato");
            }

            // Evita duplicati
            const esistente = db.prepare(`
                SELECT id
                FROM prestazioni
                WHERE appuntamento_id = ?
            `).get(appuntamento.id);

            if (esistente) {

                const referto = db.prepare(`
                    SELECT id
                    FROM referti
                    WHERE prestazione_id = ?
                `).get(esistente.id);

                return {
                    prestazione_id: esistente.id,
                    referto_id: referto?.id || null,
                    duplicato: true
                };
            }

            console.log("Appuntamento:", appuntamento);
console.log("prestazione_id:", appuntamento.prestazione_id);

            const catalogo = db.prepare(`
                SELECT *
                FROM prestazioni_catalogo
                WHERE id = ?
            `).get(appuntamento.prestazione_id);

            if (!catalogo) {
                throw new Error("Prestazione catalogo non trovata");
            }

            db.prepare(`
                UPDATE appuntamenti
                SET stato='Eseguita'
                WHERE id=?
            `).run(appuntamento.id);

            const prestazione = db.prepare(`
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

                appuntamento.paziente_id,
                appuntamento.id,
                appuntamento.prestazione_id,
                appuntamento.operatore_id,
                appuntamento.ambulatorio_id,
                appuntamento.data,
                appuntamento.note || "",
                catalogo.descrizione,
                catalogo.colore_agenda

            );

            const prestazioneId = prestazione.lastInsertRowid;

            let refertoId = null;

            console.log("Template:", catalogo.template_referto_id);

            if (catalogo.template_referto_id) {

                const referto = db.prepare(`
                    INSERT INTO referti
                    (
                        prestazione_id,
                        paziente_id,
                        template_id,
                        dati_json
                    )
                    VALUES
                    (?,?,?,?)
                `).run(

                    prestazioneId,
                    appuntamento.paziente_id,
                    catalogo.template_referto_id,
                    "{}"

                );

                console.log("Referto creato:", referto.lastInsertRowid);

                refertoId = referto.lastInsertRowid;
            }

            return {

                prestazione_id: prestazioneId,
                referto_id: refertoId,
                duplicato: false

            };

        });

        const risultato = tx();

        res.json({

            messaggio: risultato.duplicato
                ? "Prestazione già eseguita"
                : "Prestazione eseguita",

            prestazione_id: risultato.prestazione_id,

            referto_id: risultato.referto_id

        });

    }

  catch (err) {

    console.error("ERRORE APPUNTAMENTI:");
    console.error(err);

    res.status(500).json({
        errore: err.message,
        stack: err.stack
    });

}

};

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    getByPaziente,
    eseguiPrestazione
};
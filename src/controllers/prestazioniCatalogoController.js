const db = require("../config/db");

// ======================================
// ELENCO PRESTAZIONI CATALOGO
// ======================================

const getAll = (req, res) => {

    try {

       const prestazioni = db.prepare(`
   SELECT

    pc.*,

    s.nome AS specialita_nome,

    tr.nome AS template_referto_nome,

    mt.titolo AS template_modulo_nome

FROM prestazioni_catalogo pc

LEFT JOIN specialita s
    ON s.id = pc.specialita_id

LEFT JOIN template_referti tr
    ON tr.id = pc.template_referto_id

LEFT JOIN moduli_template mt
    ON mt.id = pc.template_modulo_id

WHERE pc.attiva = 1

    ORDER BY pc.descrizione
`).all();

console.table(prestazioni);

        res.json(prestazioni);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ======================================
// DETTAGLIO
// ======================================

const getOne = (req, res) => {

    try {

      const prestazione = db.prepare(`
    SELECT

        pc.*,

        s.nome AS specialita_nome,

        tr.nome AS template_nome

    FROM prestazioni_catalogo pc

    LEFT JOIN specialita s

        ON s.id = pc.specialita_id

    LEFT JOIN template_referti tr

        ON tr.id = pc.template_referto_id

    WHERE pc.id = ?
`).get(req.params.id);

        if (!prestazione) {

            return res.status(404).json({
                errore: "Prestazione non trovata"
            });

        }

        res.json(prestazione);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ======================================
// NUOVA PRESTAZIONE
// ======================================

const create = (req, res) => {

    try {

        const {

    codice,

    descrizione,

    durata,

    tariffa,

    categoria,

    colore_agenda,

    specialita_id,

    template_referto_id,

    template_modulo_id,

    attiva

} = req.body;

        const result = db.prepare(`
      INSERT INTO prestazioni_catalogo
(
    codice,
    descrizione,
    durata,
    tariffa,
    categoria,
    colore_agenda,
    specialita_id,
    template_referto_id,
    template_modulo_id,
    attiva
)
VALUES
(?,?,?,?,?,?,?,?,?,?)
        `).run(

    codice || "",

    descrizione,

    durata || 30,

    tariffa || 0,

    categoria || "",

    colore_agenda || "#2563eb",

    specialita_id || null,

template_referto_id || null,

template_modulo_id || null,

attiva ?? 1

);

        const nuova = db.prepare(`
            SELECT *
            FROM prestazioni_catalogo
            WHERE id = ?
        `).get(result.lastInsertRowid);

        res.status(201).json(nuova);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ======================================
// MODIFICA
// ======================================

const update = (req, res) => {

    try {

const {

    codice,

    descrizione,

    durata,

    tariffa,

    categoria,

    colore_agenda,

    specialita_id,

    template_referto_id,

    template_modulo_id,

    attiva

} = req.body;

        db.prepare(`
           UPDATE prestazioni_catalogo
SET
    codice = ?,
    descrizione = ?,
    durata = ?,
    tariffa = ?,
    categoria = ?,
    colore_agenda = ?,
    specialita_id = ?,
    template_referto_id = ?,
    template_modulo_id = ?,
    attiva = ?
WHERE id = ?
        `).run(

    codice,

    descrizione,

    durata,

    tariffa,

    categoria,

    colore_agenda,

    specialita_id || null,

    template_referto_id || null,

    template_modulo_id || null,

    attiva,

    req.params.id

);

        const aggiornata = db.prepare(`
            SELECT *
            FROM prestazioni_catalogo
            WHERE id = ?
        `).get(req.params.id);

        res.json(aggiornata);

    }

    catch (err) {

        console.error(err);

        res.status(500).json({
            errore: err.message
        });

    }

};

// ======================================
// ELIMINA
// ======================================

const remove = (req, res) => {

    try {

        const result = db.prepare(`
            DELETE
            FROM prestazioni_catalogo
            WHERE id = ?
        `).run(req.params.id);

        if (result.changes === 0) {

            return res.status(404).json({
                errore: "Prestazione non trovata"
            });

        }

        res.json({
            messaggio: "Prestazione eliminata"
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
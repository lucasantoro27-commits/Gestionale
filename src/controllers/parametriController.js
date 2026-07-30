// server/src/controllers/parametriVitaliController.js

const db = require("../config/db");

// =============================
// Elenco parametri di un paziente
// =============================
exports.getByPaziente = (req, res) => {
  try {
    const rows = db
      .prepare(`
        SELECT *
        FROM parametri_vitali
        WHERE paziente_id = ?
        ORDER BY data_rilevazione DESC
      `)
      .all(req.params.id);

    res.json(rows);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      errore: error.message
    });
  }
};

// =============================
// Inserimento nuovi parametri
// =============================
exports.create = (req, res) => {
  try {

    const {
      pressione_sistolica,
      pressione_diastolica,
      frequenza_cardiaca,
      saturazione,
      glicemia,
      peso,
      altezza,
      temperatura,
      note
    } = req.body;

    const result = db
      .prepare(`
        INSERT INTO parametri_vitali
        (
          paziente_id,
          pressione_sistolica,
          pressione_diastolica,
          frequenza_cardiaca,
          saturazione,
          glicemia,
          peso,
          altezza,
          temperatura,
          note
        )
        VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .run(
        req.params.id,
        pressione_sistolica,
        pressione_diastolica,
        frequenza_cardiaca,
        saturazione,
        glicemia,
        peso,
        altezza,
        temperatura,
        note
      );

    const nuovoParametro = db
      .prepare(`
        SELECT *
        FROM parametri_vitali
        WHERE id = ?
      `)
      .get(result.lastInsertRowid);

    res.status(201).json(nuovoParametro);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      errore: error.message
    });
  }
};

// =============================
// Eliminazione parametro
// =============================
exports.remove = (req, res) => {
  try {

    db.prepare(`
      DELETE
      FROM parametri_vitali
      WHERE id = ?
    `).run(req.params.id);

    res.json({
      messaggio: "Parametro eliminato"
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      errore: error.message
    });
  }
};
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const controller = require("../controllers/appuntamentiController");

// Elenco appuntamenti
router.get("/", auth, controller.getAll);

// Storico paziente
router.get("/paziente/:id", auth, controller.getByPaziente);

// Dettaglio appuntamento
router.get("/:id", auth, controller.getOne);

// Nuovo appuntamento
router.post("/", auth, controller.create);

// Esegui prestazione
router.post("/:id/esegui", auth, controller.eseguiPrestazione);

// Modifica appuntamento
router.put("/:id", auth, controller.update);

// Elimina appuntamento
router.delete("/:id", auth, controller.remove);

module.exports = router;
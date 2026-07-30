const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const controller = require("../controllers/configurazioneController");

// =========================
// CONFIGURAZIONE GENERICA
// =========================

// Restituisce tutte le chiavi di una categoria
router.get("/:categoria", auth, controller.getCategoria);

// Salva/aggiorna tutte le chiavi della categoria
router.put("/:categoria", auth, controller.salvaCategoria);

// =========================
// EMAIL
// =========================

// Verifica connessione SMTP
router.post("/email/test", auth, controller.testEmail);

// Invia email di prova
router.post("/email/send-test", auth, controller.sendTestEmail);

module.exports = router;
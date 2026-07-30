const express = require("express");
const router = express.Router();

const controller = require("../controllers/configurazioneController");
const auth = require("../middleware/auth");

// ====================================
// EMAIL
// ====================================

// Test connessione SMTP
router.post("/email/test", auth, controller.testEmail);

// Invio email di prova
router.post("/email/send-test", auth, controller.sendTestEmail);

// ====================================
// CONFIGURAZIONE GENERICA
// ====================================

// Legge una categoria
router.get("/:categoria", auth, controller.getCategoria);

// Salva una categoria
router.put("/:categoria", auth, controller.salvaCategoria);

module.exports = router;
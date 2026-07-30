const express = require("express");
const router = express.Router();

const controller = require("../controllers/cartellaClinicaController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const PERMISSIONS = require("../config/permissions");

// =======================================
// VISUALIZZA CARTELLA CLINICA
// =======================================

router.get(
    "/:id",
    auth,
    authorize(...PERMISSIONS.cartellaClinica.view),
    controller.getCartellaClinica
);

// =======================================
// MODIFICA CARTELLA CLINICA
// =======================================

router.put(
    "/:id",
    auth,
    authorize(...PERMISSIONS.cartellaClinica.update),
    controller.update
);

module.exports = router;
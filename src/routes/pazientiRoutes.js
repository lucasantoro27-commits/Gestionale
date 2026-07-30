const express = require("express");

const router = express.Router();

const pazientiController = require("../controllers/pazientiController");

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const PERMISSIONS = require("../config/permissions");

// ===========================
// ELENCO PAZIENTI
// ===========================

router.get(
    "/",
    auth,
    authorize(...PERMISSIONS.pazienti.view),
    pazientiController.getAll
);

// ===========================
// RICERCA PAZIENTI
// ===========================

router.get(
    "/search",
    auth,
    authorize(...PERMISSIONS.pazienti.view),
    pazientiController.search
);

// ===========================
// DETTAGLIO PAZIENTE
// ===========================

router.get(
    "/:id",
    auth,
    authorize(...PERMISSIONS.pazienti.view),
    pazientiController.getOne
);

// ===========================
// NUOVO PAZIENTE
// ===========================

router.post(
    "/",
    auth,
    authorize(...PERMISSIONS.pazienti.create),
    pazientiController.create
);

// ===========================
// MODIFICA PAZIENTE
// ===========================

router.put(
    "/:id",
    auth,
    authorize(...PERMISSIONS.pazienti.update),
    pazientiController.update
);

// ===========================
// ELIMINA PAZIENTE
// ===========================

router.delete(
    "/:id",
    auth,
    authorize(...PERMISSIONS.pazienti.delete),
    pazientiController.remove
);

module.exports = router;
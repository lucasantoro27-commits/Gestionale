const express = require("express");
const router = express.Router();

const controller = require("../controllers/utentiController");
const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const PERMISSIONS = require("../config/permissions");

// ===========================
// ELENCO
// ===========================

router.get(
    "/",
    auth,
    authorize(...PERMISSIONS.utenti.view),
    controller.getAll
);

// ===========================
// DETTAGLIO
// ===========================

router.get(
    "/:id",
    auth,
     authorize(...PERMISSIONS.utenti.view),
    controller.getOne
);

// ===========================
// NUOVO
// ===========================

router.post(
    "/",
    auth,
    authorize(...PERMISSIONS.utenti.create),
    controller.create
);

// ===========================
// MODIFICA
// ===========================

router.put(
    "/:id",
    auth,
    authorize(...PERMISSIONS.utenti.update),
    controller.update
);

// ===========================
// DISATTIVA
// ===========================

router.delete(
    "/:id",
    auth,
    authorize(...PERMISSIONS.utenti.delete),
    controller.remove
);

module.exports = router;
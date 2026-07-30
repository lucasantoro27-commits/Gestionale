const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");

const PERMISSIONS = require("../config/permissions");

const {

    getAll,
    getByPaziente,
    getOne,
    create,
    update,
    remove

} = require("../controllers/prestazioniController");

// =======================================
// ELENCO PRESTAZIONI
// =======================================

router.get(
    "/",
    auth,
    authorize(...PERMISSIONS.prestazioni.view),
    getAll
);

// =======================================
// PRESTAZIONI DEL PAZIENTE
// =======================================

router.get(
    "/paziente/:id",
    auth,
    authorize(...PERMISSIONS.prestazioni.view),
    getByPaziente
);

// =======================================
// DETTAGLIO PRESTAZIONE
// =======================================

router.get(
    "/:id",
    auth,
    authorize(...PERMISSIONS.prestazioni.view),
    getOne
);

// =======================================
// NUOVA PRESTAZIONE
// =======================================

router.post(
    "/",
    auth,
    authorize(...PERMISSIONS.prestazioni.create),
    create
);

// =======================================
// MODIFICA PRESTAZIONE
// =======================================

router.put(
    "/:id",
    auth,
    authorize(...PERMISSIONS.prestazioni.update),
    update
);

// =======================================
// ELIMINA PRESTAZIONE
// =======================================

router.delete(
    "/:id",
    auth,
    authorize(...PERMISSIONS.prestazioni.delete),
    remove
);

module.exports = router;
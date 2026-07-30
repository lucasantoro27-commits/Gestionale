const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const controller = require("../controllers/consensiController");

// ======================================================
// TEMPLATE DELLA PRESTAZIONE
// Carica automaticamente il consenso associato
// ======================================================

router.get(
    "/prestazione/:id",
    auth,
    controller.getByPrestazione
);

// ======================================================
// TUTTI I CONSENSI DEL PAZIENTE
// ======================================================

router.get(
    "/paziente/:id",
    auth,
    controller.getByPaziente
);

router.get("/:id", auth, controller.getOne);

// ======================================================
// SALVA CONSENSO FIRMATO
// ======================================================

router.post(
    "/",
    auth,
    controller.create
);

module.exports = router;
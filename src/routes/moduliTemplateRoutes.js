const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const moduliTemplateController = require("../controllers/moduliTemplateController");

// ==============================
// TEMPLATE
// ==============================

// Elenco template
router.get(
    "/",
    auth,
    moduliTemplateController.getAll
);

// Singolo template
router.get(
    "/:id",
    auth,
    moduliTemplateController.getOne
);

// Template per categoria
router.get(
    "/categoria/:id",
    auth,
    moduliTemplateController.getByCategoria
);

// Nuovo template
router.post(
    "/",
    auth,
    moduliTemplateController.create
);

// Modifica template
router.put(
    "/:id",
    auth,
    moduliTemplateController.update
);

// Elimina template
router.delete(
    "/:id",
    auth,
    moduliTemplateController.remove
);

module.exports = router;
const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const authorize = require("../middleware/authorize");
const PERMISSIONS = require("../config/permissions");

const {

    getAllTemplates,

    getTemplate,

    createTemplate,

    updateTemplate,

    deleteTemplate,


} = require("../controllers/templateRefertiController");


// =======================================
// TEMPLATE
// =======================================

// Elenco template
router.get(
    "/",
    auth,
    authorize(...PERMISSIONS.templateReferti.view),
    getAllTemplates
);

// Singolo template con campi
router.get(
    "/:id",
    auth,
    authorize(...PERMISSIONS.templateReferti.view),
    getTemplate
);

// Nuovo template
router.post(
    "/",
    auth,
    authorize(...PERMISSIONS.templateReferti.create),
    createTemplate
);

// Modifica template
router.put(
    "/:id",
    auth,
    authorize(...PERMISSIONS.templateReferti.update),
    updateTemplate
);

// Elimina template
router.delete(
    "/:id",
    auth,
    authorize(...PERMISSIONS.templateReferti.delete),
    deleteTemplate
);

module.exports = router;
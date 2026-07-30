const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

    getAll,

    getOne,

    getNuovoReferto,

    create,

    update,

    remove,

    downloadPdf,

    firmaReferto

} = require("../controllers/refertiController");


// =======================================
// ELENCO REFERTI
// =======================================

router.get(

    "/",

    auth,

    getAll

);


// =======================================
// DATI PER NUOVO REFERTO
// =======================================

router.get(

    "/nuovo/:prestazioneId",

    auth,

    getNuovoReferto

);

router.get("/:id/pdf", downloadPdf);

router.put("/:id/firma", auth, firmaReferto);

// =======================================
// REFERTO PER ID
// =======================================

router.get(

    "/:id",

    auth,

    getOne

);


// =======================================
// CREA REFERTO
// =======================================

router.post(

    "/",

    auth,

    create

);


// =======================================
// AGGIORNA REFERTO
// =======================================

router.put(

    "/:id",

    auth,

    update

);


// =======================================
// ELIMINA REFERTO
// =======================================

router.delete(

    "/:id",

    auth,

    remove

);


module.exports = router;
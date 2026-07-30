const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const uploadLogo = require("../middleware/uploadLogo");

const {getStudio,salvaStudio} = require("../controllers/impostazioniController");

router.get(
    "/studio",
    auth,
    getStudio
);

router.put(
    "/studio",
    auth,
    salvaStudio
);

router.post(

    "/studio/logo",

    auth,

    uploadLogo.single("logo"),

    (req, res) => {

        res.json({

            logo: "/uploads/loghi/" + req.file.filename

        });

    }

);

module.exports = router;
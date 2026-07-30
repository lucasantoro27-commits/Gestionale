const multer = require("multer");
const path = require("path");
const fs = require("fs");

const cartella = path.join(__dirname, "../../uploads/loghi");


if (!fs.existsSync(cartella)) {
    fs.mkdirSync(cartella, { recursive: true });
}

const storage = multer.diskStorage({

    destination(req, file, cb) {

        cb(null, cartella);

    },

    filename(req, file, cb) {

        const estensione = path.extname(file.originalname);

        cb(
            null,
            "logo" + Date.now() + estensione
        );

    }

});

module.exports = multer({

    storage,

    fileFilter(req, file, cb) {

        if (
            file.mimetype.startsWith("image/")
        ) {

            cb(null, true);

        } else {

            cb(new Error("File non valido"));

        }

    }

});
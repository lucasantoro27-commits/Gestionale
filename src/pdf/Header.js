const path = require("path");
const fs = require("fs");

const {
    LEFT,
    CONTENT_WIDTH,
    utils
} = require("./PdfUtils");

class Header {

    disegna(doc, referto) {

        const studio = referto.studio || {};
        const colore = utils.colore(referto);

        // ---------------- Logo ----------------

        let logo = path.join(
            __dirname,
            "../../pubblic/logo.png"
        );

        console.log("=== HEADER PDF ===");
console.log("studio.logo =", studio.logo);

const fileLogo = studio.logo
    ? path.join(__dirname, "../../", studio.logo.replace(/^\//, ""))
    : null;

console.log("Percorso assoluto =", fileLogo);

if (fileLogo) {
    console.log("Esiste =", fs.existsSync(fileLogo));
}

        if (studio.logo) {

            const fileLogo = path.join(
                __dirname,
                "../../",
                studio.logo.replace(/^\//, "")
            );

            if (fs.existsSync(fileLogo))
                logo = fileLogo;
        }

        if (fs.existsSync(logo)) {

            doc.image(
                logo,
                LEFT,
                28,
                {
                    width: 82
                }
            );

        }

        // ---------------- Nome Studio ----------------

        doc
            .font("Helvetica-Bold")
            .fontSize(23)
            .fillColor("#1b1b1b")
            .text(
                studio.nome || "MEDICAJATO CENTER",
                150,
                30
            );

        // ---------------- Sottotitolo ----------------

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#5c5c5c")
            .text(
                "Centro di Prevenzione e Diagnostica",
                150,
                58
            );

        // ---------------- Indirizzo ----------------

        const indirizzo = [
            studio.indirizzo,
            studio.cap,
            studio.comune,
            studio.provincia
                ? "(" + studio.provincia + ")"
                : ""
        ]
            .filter(Boolean)
            .join(" ");

        doc
            .font("Helvetica")
            .fontSize(9)
            .fillColor("#555")
            .text(
                indirizzo,
                150,
                82,
                {
                    width: 360
                }
            );

        // ---------------- Contatti ----------------

        if (studio.telefono)
            doc.text(
                "Telefono: " + studio.telefono,
                150,
                98
            );

        if (studio.email)
            doc.text(
                "Email: " + studio.email,
                150,
                111
            );

        if (studio.sito)
            doc.text(
                "Sito: " + studio.sito,
                150,
                124
            );

        // ---------------- Dati fiscali ----------------

        let fiscale = [];

        if (studio.partita_iva)
            fiscale.push("P.IVA " + studio.partita_iva);

        if (studio.codice_fiscale)
            fiscale.push("C.F. " + studio.codice_fiscale);

        if (fiscale.length) {

            doc
                .fontSize(8)
                .fillColor("#777")
                .text(
                    fiscale.join("   •   "),
                    150,
                    138
                );

        }

        // ---------------- Riga blu ----------------

        doc
            .lineWidth(3)
            .strokeColor(colore)
            .moveTo(LEFT, 160)
            .lineTo(545, 160)
            .stroke();

        // ---------------- Titolo Prestazione ----------------

        doc
            .font("Helvetica-Bold")
            .fontSize(18)
            .fillColor(colore)
            .text(
                referto.template.nome.toUpperCase(),
                LEFT,
                173,
                {
                    width: CONTENT_WIDTH,
                    align: "center"
                }
            );

        doc.y = 205;

    }

}

module.exports = new Header();
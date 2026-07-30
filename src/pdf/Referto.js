const {
    LEFT,
    CONTENT_WIDTH,
    utils
} = require("./PdfUtils");

class Referto {

    disegna(doc, dati, referto) {

        const colore = utils.colore(referto);

        // Titolo sezione

        doc
            .roundedRect(
                LEFT,
                doc.y,
                CONTENT_WIDTH,
                24,
                4
            )
            .fillColor(colore)
            .fill();

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("white")
            .text(
                "REFERTO",
                LEFT + 12,
                doc.y - 17
            );

        doc.y += 12;

        const entries = Object.entries(dati || {});
        let alterna = false;

        for (const [chiave, valore] of entries) {

            if (
                valore === null ||
                valore === undefined ||
                valore === ""
            ) continue;

            const testo = String(valore);

            const altezza = Math.max(
                26,
                doc.heightOfString(testo, {
                    width: 300
                }) + 12
            );

            // Cambio pagina

            if (doc.y + altezza + 40 > doc.page.height - 60) {

                doc.addPage();

                doc.y = 50;

            }

            // Riga alternata

            if (alterna) {

                doc
                    .rect(
                        LEFT,
                        doc.y,
                        CONTENT_WIDTH,
                        altezza
                    )
                    .fillColor("#F7F9FB")
                    .fill();

            }

            // Etichetta

            doc
                .font("Helvetica-Bold")
                .fontSize(10)
                .fillColor(colore)
                .text(
                    this.formattaTitolo(chiave),
                    LEFT + 12,
                    doc.y + 7,
                    {
                        width: 160
                    }
                );

            // Valore

            doc
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#222")
                .text(
                    testo,
                    LEFT + 180,
                    doc.y + 7,
                    {
                        width: 275,
                        align: "left"
                    }
                );

            // Separatore

            doc
                .moveTo(
                    LEFT,
                    doc.y + altezza
                )
                .lineTo(
                    LEFT + CONTENT_WIDTH,
                    doc.y + altezza
                )
                .lineWidth(0.4)
                .strokeColor("#DADADA")
                .stroke();

            doc.y += altezza;

            alterna = !alterna;

        }

        doc.moveDown();

    }

    formattaTitolo(testo) {

        return testo
            .replace(/_/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase());

    }

}

module.exports = new Referto();
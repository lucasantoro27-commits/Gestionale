const Box = require("./Box");
const { utils } = require("./PdfUtils");

class Prestazione {

    disegna(doc, prestazione, referto) {

        const colore = utils.colore(referto);

        const box = Box.disegna(
            doc,
            "Prestazione",
            colore,
            100
        );

        let y = box.contentY;

        const sinistra = box.x + 15;
        const valore = box.x + 120;

        // Prestazione
        Box.etichetta(doc, "Prestazione", sinistra, y);

        Box.valore(
            doc,
            prestazione.descrizione || "",
            valore,
            y,
            320
        );

        y += 24;

        // Data
        Box.etichetta(doc, "Data", sinistra, y);

        Box.valore(
            doc,
            utils.formattaData(prestazione.data),
            valore,
            y
        );

        // Ora (se disponibile)

        if (prestazione.ora) {

            y += 20;

            Box.etichetta(doc, "Ora", sinistra, y);

            Box.valore(
                doc,
                prestazione.ora,
                valore,
                y
            );

        }

        // Medico

        if (prestazione.medico) {

            y += 20;

            Box.etichetta(doc, "Professionista", sinistra, y);

            Box.valore(
                doc,
                prestazione.medico,
                valore,
                y,
                300
            );

        }

        // Numero referto (se presente)

        if (referto.numero) {

            doc
                .font("Helvetica")
                .fontSize(9)
                .fillColor("#777")
                .text(
                    "Referto n. " + referto.numero,
                    box.x + box.width - 150,
                    box.y + 10,
                    {
                        width: 135,
                        align: "right"
                    }
                );

        }

        doc.fillColor("black");

        doc.y = box.y + box.height + 18;

    }

}

module.exports = new Prestazione();
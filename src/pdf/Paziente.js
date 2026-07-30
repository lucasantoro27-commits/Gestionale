const Box = require("./Box");
const { utils } = require("./PdfUtils");

class Paziente {

    disegna(doc, prestazione, referto) {

        const colore = utils.colore(referto);

        const box = Box.disegna(
            doc,
            "Dati Paziente",
            colore,
            120
        );

        let y = box.contentY;

        const sinistra = box.x + 15;
        const valore = box.x + 120;

        // Nome
        Box.etichetta(doc, "Nome", sinistra, y);
        Box.valore(
            doc,
            `${prestazione.nome || ""} ${prestazione.cognome || ""}`,
            valore,
            y
        );

        y += 20;

        // Codice fiscale
        Box.etichetta(doc, "Codice Fiscale", sinistra, y);
        Box.valore(
            doc,
            prestazione.codice_fiscale,
            valore,
            y
        );

        y += 20;

        // Data di nascita
        Box.etichetta(doc, "Data di nascita", sinistra, y);
        Box.valore(
            doc,
            utils.formattaData(prestazione.data_nascita),
            valore,
            y
        );

        y += 20;

       

        // Colonna destra

        y = box.contentY;

        const col2 = box.x + 300;
        const col2Val = box.x + 380;

        if (prestazione.telefono) {

            Box.etichetta(doc, "Telefono", col2, y);
            Box.valore(
                doc,
                prestazione.telefono,
                col2Val,
                y,
                120
            );

            y += 20;
        }

        if (prestazione.email) {

            Box.etichetta(doc, "Email", col2, y);
            Box.valore(
                doc,
                prestazione.email,
                col2Val,
                y,
                120
            );

        }

        doc.y = box.y + box.height + 15;

    }

}

module.exports = new Paziente();
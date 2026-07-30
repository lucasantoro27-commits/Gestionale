const {
    LEFT,
    CONTENT_WIDTH,
    utils
} = require("./PdfUtils");

class Box {

    disegna(doc, titolo, colore, altezza = 90) {

        const x = LEFT;
        const y = doc.y;

        // Ombra leggera
        doc
            .save()
            .roundedRect(
                x + 2,
                y + 2,
                CONTENT_WIDTH,
                altezza,
                6
            )
            .fillOpacity(0.05)
            .fill("#000000")
            .restore();

        // Box principale
        doc
            .roundedRect(
                x,
                y,
                CONTENT_WIDTH,
                altezza,
                6
            )
            .fillColor("#FFFFFF")
            .fill();

        doc
            .roundedRect(
                x,
                y,
                CONTENT_WIDTH,
                altezza,
                6
            )
            .lineWidth(1)
            .strokeColor("#D8E0E8")
            .stroke();

        // Barra superiore
        doc
            .roundedRect(
                x,
                y,
                CONTENT_WIDTH,
                24,
                6
            )
            .fillColor(colore)
            .fill();

        // Titolo
        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("white")
            .text(
                titolo.toUpperCase(),
                x + 12,
                y + 7
            );

        doc.fillColor("black");

        return {
            x,
            y,
            contentY: y + 34,
            width: CONTENT_WIDTH,
            height: altezza
        };

    }

    etichetta(doc, testo, x, y) {

        utils
            .testoEtichetta(doc)
            .text(
                testo,
                x,
                y
            );

    }

    valore(doc, testo, x, y, width = 250) {

        utils
            .testoValore(doc)
            .text(
                testo || "",
                x,
                y,
                {
                    width
                }
            );

    }

}

module.exports = new Box();
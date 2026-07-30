const PAGE_WIDTH = 595;
const PAGE_HEIGHT = 842;

const CONTENT_WIDTH = 470;
const LEFT = (PAGE_WIDTH - CONTENT_WIDTH) / 2;

class PdfUtils {

    formattaData(data) {

        if (!data) return "";

        try {
            return new Date(data).toLocaleDateString("it-IT");
        } catch {
            return data;
        }

    }

    colore(referto) {

        return referto?.studio?.colore || "#1565C0";

    }

    linea(doc, y = null) {

        if (y !== null)
            doc.y = y;

        doc
            .lineWidth(1)
            .strokeColor("#D7DCE2")
            .moveTo(LEFT, doc.y)
            .lineTo(LEFT + CONTENT_WIDTH, doc.y)
            .stroke();

    }

    testoEtichetta(doc) {

        return doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#666666");

    }

    testoValore(doc) {

        return doc
            .font("Helvetica-Bold")
            .fontSize(10)
            .fillColor("#222222");

    }

    titolo(doc, testo, colore) {

        return doc
            .font("Helvetica-Bold")
            .fontSize(18)
            .fillColor(colore)
            .text(
                testo,
                LEFT,
                doc.y,
                {
                    width: CONTENT_WIDTH,
                    align: "center"
                }
            );

    }

}

module.exports = {

    PAGE_WIDTH,
    PAGE_HEIGHT,
    CONTENT_WIDTH,
    LEFT,

    utils: new PdfUtils()

};
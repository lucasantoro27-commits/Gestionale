const { LEFT, CONTENT_WIDTH } = require("./PdfUtils");

class Footer {

    disegna(doc, referto, pagina = 1, totale = 1) {

        const studio = referto?.studio || {};

        const oldX = doc.x;
        const oldY = doc.y;

        const y = doc.page.height - 40;

        // Riga superiore
        doc
            .lineWidth(0.5)
            .strokeColor("#D8D8D8")
            .moveTo(LEFT, y - 8)
            .lineTo(LEFT + CONTENT_WIDTH, y - 8)
            .stroke();

        doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor("#666666");

        // Nome studio
        doc.text(
            studio.nome || "",
            LEFT,
            y,
            {
                width: 180,
                lineBreak: false
            }
        );

        // Sito web
        doc.text(
            studio.sito || "",
            LEFT + 180,
            y,
            {
                width: 140,
                align: "center",
                lineBreak: false
            }
        );

        // Numero pagina
        doc.text(
            `Pagina ${pagina} / ${totale}`,
            LEFT + CONTENT_WIDTH - 90,
            y,
            {
                width: 90,
                align: "right",
                lineBreak: false
            }
        );

        doc.x = oldX;
        doc.y = oldY;

        doc.fillColor("black");
    }

}

module.exports = new Footer();
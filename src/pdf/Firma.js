const { LEFT, CONTENT_WIDTH, utils } = require("./PdfUtils");

class Firma {

    disegna(doc, prestazione, referto) {

        const colore = utils.colore(referto);

        const y = doc.y + 25;

        // linea superiore

        doc
            .lineWidth(1)
            .strokeColor("#D9DDE2")
            .moveTo(LEFT, y)
            .lineTo(LEFT + CONTENT_WIDTH, y)
            .stroke();

        doc.y = y + 25;

        const firmaX = LEFT + CONTENT_WIDTH - 220;

        doc
            .font("Helvetica")
            .fontSize(10)
            .fillColor("#666")
            .text(
                "Firma del Professionista",
                firmaX,
                doc.y,
                {
                    width: 200,
                    align: "center"
                }
            );

        doc.moveDown(2);

        if (prestazione.medico) {

            doc
                .font("Helvetica-Bold")
                .fontSize(11)
                .fillColor(colore)
                .text(
                    prestazione.medico,
                    firmaX,
                    doc.y,
                    {
                        width: 200,
                        align: "center"
                    }
                );

        

        }

    }

}

module.exports = new Firma();
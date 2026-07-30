const {
    LEFT,
    CONTENT_WIDTH,
    utils
} = require("./PdfUtils");

const Header = require("./Header");

class RefertoRenderer {

    formattaTitolo(testo) {

        if (!testo) return "";

        return testo
            .replace(/_/g, " ")
            .replace(/\b\w/g, l => l.toUpperCase());

    }

    nuovaPagina(doc, referto) {

        doc.addPage();

        Header.disegna(doc, referto);

        return doc.y;

    }

    disegna(doc, struttura, dati, referto) {

        const colore = utils.colore(referto);

        let y = doc.y;

        const sezioni = struttura?.sezioni || [];

        for (const sezione of sezioni) {

            // Se non c'è spazio sufficiente
            if (y > 690) {

                y = this.nuovaPagina(
                    doc,
                    referto
                );

            }

            // -----------------------------
            // Titolo sezione
            // -----------------------------

            doc
                .roundedRect(
                    LEFT,
                    y,
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
                    sezione.titolo || "",
                    LEFT + 12,
                    y + 6
                );

            y += 34;

            let alterna = false;

            const campi = sezione.campi || [];

            for (const campo of campi) {

                const valore =
                    dati[campo.id] !== undefined &&
                    dati[campo.id] !== null &&
                    String(dati[campo.id]).trim() !== ""
                        ? String(dati[campo.id])
                        : "—";

                const label = campo.label || "";

                const altezzaLabel =
                    doc.heightOfString(
                        label,
                        {
                            width: 165
                        }
                    );

                const altezzaValore =
                    doc.heightOfString(
                        valore,
                        {
                            width: 280
                        }
                    );

                const altezzaRiga =
                    Math.max(
                        altezzaLabel,
                        altezzaValore
                    ) + 14;

                // Cambio pagina

                if (y + altezzaRiga > 735) {

                    y = this.nuovaPagina(
                        doc,
                        referto
                    );

                    // Ripete il titolo della sezione

                    doc
                        .roundedRect(
                            LEFT,
                            y,
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
                            sezione.titolo || "",
                            LEFT + 12,
                            y + 6
                        );

                    y += 34;

                }
                                // Sfondo alternato

                if (alterna) {

                    doc
                        .rect(
                            LEFT,
                            y,
                            CONTENT_WIDTH,
                            altezzaRiga
                        )
                        .fillColor("#F8FAFC")
                        .fill();

                }

                // Etichetta

                doc
                    .font("Helvetica-Bold")
                    .fontSize(10)
                    .fillColor(colore)
                    .text(
                        this.formattaTitolo(label),
                        LEFT + 12,
                        y + 7,
                        {
                            width: 165
                        }
                    );

                // Valore

                doc
                    .font("Helvetica")
                    .fontSize(10)
                    .fillColor("#222")
                    .text(
                        valore,
                        LEFT + 185,
                        y + 7,
                        {
                            width: 270,
                            align: "left"
                        }
                    );

                // Riga separatrice

                doc
                    .moveTo(
                        LEFT,
                        y + altezzaRiga
                    )
                    .lineTo(
                        LEFT + CONTENT_WIDTH,
                        y + altezzaRiga
                    )
                    .lineWidth(0.4)
                    .strokeColor("#E3E7EC")
                    .stroke();

                y += altezzaRiga;

                alterna = !alterna;

            }

            y += 18;

        }

        doc.y = y;

    }

}

module.exports = new RefertoRenderer();
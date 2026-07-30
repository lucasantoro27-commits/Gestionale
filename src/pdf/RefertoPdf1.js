const PDFDocument = require("pdfkit");
const path = require("path");
const fs = require("fs");

const PAGE_WIDTH = 595;
const CONTENT_WIDTH = 470;
const LEFT = (PAGE_WIDTH - CONTENT_WIDTH) / 2;

class RefertoPdf {

    formattaData(data) {

        if (!data) return "";

        try {
            return new Date(data).toLocaleDateString("it-IT");
        } catch {
            return data;
        }

    }

    colore(referto) {
        return referto.studio?.colore || "#0b5cab";
    }

    linea(doc) {

        doc
            .moveTo(LEFT, doc.y)
            .lineTo(545, doc.y)
            .strokeColor("#d9d9d9")
            .stroke();

       

    }

    disegnaHeader(doc, referto) {

        const studio = referto.studio || {};

        let logo = path.join(
            __dirname,
            "../../pubblic/logo.png"
        );

        if (studio.logo) {

            const prova = path.join(
                __dirname,
                "../../",
                studio.logo.replace(/^\//, "")
            );

            if (fs.existsSync(prova))
                logo = prova;

        }

        if (fs.existsSync(logo)) {

            doc.image(
                logo,
                LEFT,
                35,
                {
                    width: 82
                }
            );

        }

        doc
            .font("Helvetica-Bold")
            .fontSize(22)
            .fillColor("#222")
            .text(
                studio.nome || "MEDICAJATO CENTER",
                155,
                35
            );

       

        const indirizzo = [

            studio.indirizzo,
            studio.cap,
            studio.comune,
            studio.provincia
                ? `(${studio.provincia})`
                : ""

        ].filter(Boolean).join(" ");

        doc
            .fontSize(9)
            .fillColor("#666")
            .text(
                indirizzo,
                155,
                82
            );

        const contatti = [

            studio.telefono,
            studio.email,
            studio.sito

        ].filter(Boolean).join("   •   ");

        doc
            .fontSize(9)
            .text(
                contatti,
                155,
                75
            );

        doc
            .moveTo(LEFT, 125)
            .lineTo(545, 125)
            .strokeColor(this.colore(referto))
            .lineWidth(3)
            .stroke();

       

    doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(this.colore(referto))
    .text(
        referto.template.nome.toUpperCase(),
        LEFT,
        142,
        {
            width: CONTENT_WIDTH,
            align: "center"
        }
    );

       

        this.linea(doc);

        doc.fillColor("black");

    }

    disegnaFooter(doc, referto, pagina, totale) {

    const studio = referto.studio || {};

    // Salva la posizione corrente
    const oldX = doc.x;
    const oldY = doc.y;

    // Coordinate fisse del footer
    const y = 785;

    doc
        .lineWidth(1)
        .strokeColor("#d9d9d9")
        .moveTo(LEFT, y)
        .lineTo(545, y)
        .stroke();

    doc
        .font("Helvetica")
        .fontSize(8)
        .fillColor("#666");

    doc.text(
        studio.nome || "",
        LEFT,
        y + 7,
        {
            width: 180,
            lineBreak: false
        }
    );

    doc.text(
        studio.sito || "",
        220,
        y + 7,
        {
            width: 170,
            align: "center",
            lineBreak: false
        }
    );

    doc.text(
        `Pagina ${pagina} / ${totale}`,
        430,
        y + 7,
        {
            width: 110,
            align: "right",
            lineBreak: false
        }
    );

    // Ripristina la posizione del cursore
    doc.x = oldX;
    doc.y = oldY;

    doc.fillColor("black");
}

    box(doc, titolo, altezza = 80) {

        const x = LEFT;

        const y = doc.y;

        doc
            .rect(
                x,
                y,
                CONTENT_WIDTH,
                altezza
            )
            .strokeColor("#bbbbbb")
            .stroke();

        doc
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(

                titolo,

                x + 10,

                y + 8

            );

        return {

            x,

            y

        };

    }
        disegnaPaziente(doc, prestazione,referto) {

        const box = this.box(doc, "DATI PAZIENTE", 90);

        let y = box.y + 28;

        doc
            .font("Helvetica")
            .fontSize(10);

        doc.text(
            "Nome:",
            65,
            y
        );

        doc.font("Helvetica-Bold").text(
            (prestazione.nome || "") +
            " " +
            (prestazione.cognome || ""),
            140,
            y
        );

        y += 18;

        doc.font("Helvetica").text(
            "Codice Fiscale:",
            65,
            y
        );

        doc.font("Helvetica-Bold").text(
            prestazione.codice_fiscale || "",
            140,
            y
        );

        y += 18;

        doc.font("Helvetica").text(
            "Data nascita:",
            65,
            y
        );

        doc.font("Helvetica-Bold").text(
            this.formattaData(prestazione.data_nascita),
            140,
            y
        );

        y += 18;

        doc.font("Helvetica").text(
            "Sesso:",
            65,
            y
        );

        doc.font("Helvetica-Bold").text(
            prestazione.sesso || "",
            140,
            y
        );

        doc.y = box.y + 105;

    }

    disegnaPrestazione(doc, prestazione,referto) {

        const box = this.box(doc, "PRESTAZIONE", 70);

        let y = box.y + 28;

        doc
            .font("Helvetica")
            .fontSize(10);

        doc.text(
            "Prestazione:",
            65,
            y
        );

        doc.font("Helvetica-Bold").text(
            prestazione.descrizione || "",
            140,
            y,
            {
                width: 360
            }
        );

        y += 20;

        doc.font("Helvetica").text(
            "Data:",
            65,
            y
        );

        doc.font("Helvetica-Bold").text(
            this.formattaData(prestazione.data),
            140,
            y
        );

        doc.y = box.y + 85;

    }

   disegnaReferto(doc, struttura, dati, referto) {

    const colore = this.colore(referto);

    let y = doc.y;

    for (const sezione of (struttura.sezioni || [])) {

        // Spazio sufficiente per iniziare una nuova sezione
        if (y > 690) {
            doc.addPage();
            this.disegnaHeader(doc, referto);
            y = doc.y;
        }

        // Barra del titolo
        doc
            .roundedRect(LEFT, y, CONTENT_WIDTH, 24, 3)
            .fillColor(colore)
            .fill();

        doc
            .font("Helvetica-Bold")
            .fontSize(11)
            .fillColor("white")
            .text(
                sezione.titolo || "",
                LEFT + 10,
                y + 6
            );

        y += 32;

        for (const campo of (sezione.campi || [])) {

            const valore =
                dati[campo.id] !== undefined &&
                dati[campo.id] !== null &&
                String(dati[campo.id]).trim() !== ""
                    ? String(dati[campo.id])
                    : "—";

            const label = campo.label || "";

            const hLabel = doc.heightOfString(label, {
                width: 170
            });

            const hValue = doc.heightOfString(valore, {
                width: 270
            });

            const rowHeight = Math.max(hLabel, hValue) + 10;

            // Nuova pagina se la riga non entra
            if (y + rowHeight > 740) {

                doc.addPage();
                this.disegnaHeader(doc, referto);

                y = doc.y;

                doc
                    .roundedRect(LEFT, y, CONTENT_WIDTH, 24, 3)
                    .fillColor(colore)
                    .fill();

                doc
                    .font("Helvetica-Bold")
                    .fontSize(11)
                    .fillColor("white")
                    .text(
                        sezione.titolo || "",
                        LEFT + 10,
                        y + 6
                    );

                y += 32;
            }

            // Label
            doc
                .font("Helvetica")
                .fontSize(10)
                .fillColor("#555")
                .text(label, LEFT, y, {
                    width: 170
                });

            // Valore
            doc
                .font("Helvetica-Bold")
                .fillColor("black")
                .text(valore, LEFT + 180, y, {
                    width: 290
                });

            // Riga separatrice
            doc
                .moveTo(LEFT, y + rowHeight)
                .lineTo(545, y + rowHeight)
                .strokeColor("#ececec")
                .stroke();

            y += rowHeight;
        }

        y += 15;
    }

    doc.y = y;
}

disegnaFirma(doc, referto) {

    const studio = referto.studio || {};

    if (doc.y > 680) {
        doc.addPage();
    }

   

    doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#666")
        .text(
            "Referto validato da",
            {
                align: "right"
            }
        );


    doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor("black")
        .text(
            studio.direttore_sanitario || "",
            {
                align: "right"
            }
        );

    

    doc.text(
        "_______________________________",
        {
            align: "right"
        }
    );

   

    doc
        .font("Helvetica")
        .fontSize(10)
        .fillColor("#666")
        .text(
            "Firma",
            {
                align: "right"
            }
        );

    doc.fillColor("black");

}        

async genera(refertoCompleto) {

    const doc = new PDFDocument({
        size: "A4",
        margins: {
            top: LEFT,
            bottom: 60,
            left: LEFT,
            right: LEFT
        },
        bufferPages: true
    });

    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));

    return new Promise((resolve) => {

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        // ---------------- HEADER ----------------
        this.disegnaHeader(doc, refertoCompleto);

        // ---------------- PAZIENTE ----------------
        this.disegnaPaziente(
            doc,
            refertoCompleto.prestazione,
            refertoCompleto
        );

        

        // ---------------- PRESTAZIONE ----------------
        this.disegnaPrestazione(
            doc,
            refertoCompleto.prestazione,
            refertoCompleto
        );

        

        // ---------------- TITOLO ----------------
      doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor(this.colore(refertoCompleto))
    .text(
        "REFERTO",
        LEFT,
        doc.y,
        {
            width: CONTENT_WIDTH,
            align: "center"
        }
    );

        

        // ---------------- CONTENUTO ----------------
        this.disegnaReferto(
            doc,
            refertoCompleto.struttura,
            refertoCompleto.dati,
            refertoCompleto
        );

        // ---------------- FIRMA ----------------
        this.disegnaFirma(
            doc,
            refertoCompleto
        );

        // ---------------- FOOTER ----------------
        //const pages = doc.bufferedPageRange();

        //for (let i = 0; i < pages.count; i++) {

          //  doc.switchToPage(i);

            //this.disegnaFooter(
              //  doc,
                //refertoCompleto,
                //i + 1,
                //pages.count
            //);

        //}

        doc.end();

    });

}
}

module.exports = new RefertoPdf();
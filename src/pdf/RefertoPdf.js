const PDFDocument = require("pdfkit");

const Header = require("./Header");
const Paziente = require("./Paziente");
const Prestazione = require("./Prestazione");
const RefertoRenderer = require("./RefertoRenderer");
const Firma = require("./Firma");
const Footer = require("./Footer");

const {
    LEFT
} = require("./PdfUtils");

class RefertoPdf {

    async genera(refertoCompleto) {

        const doc = new PDFDocument({

            size: "A4",

            margins: {

                top: LEFT,
                left: LEFT,
                right: LEFT,
                bottom: 60

            },

            bufferPages: true

        });

        const buffers = [];

        doc.on(
            "data",
            buffers.push.bind(buffers)
        );

        return new Promise((resolve) => {

            doc.on("end", () => {

                resolve(
                    Buffer.concat(buffers)
                );

            });

            // ==========================
            // HEADER
            // ==========================

            Header.disegna(
                doc,
                refertoCompleto
            );

            // ==========================
            // PAZIENTE
            // ==========================

            Paziente.disegna(
                doc,
                refertoCompleto.prestazione,
                refertoCompleto
            );

            // ==========================
            // PRESTAZIONE
            // ==========================

            Prestazione.disegna(
                doc,
                refertoCompleto.prestazione,
                refertoCompleto
            );

            // ==========================
            // REFERTO
            // ==========================

            RefertoRenderer.disegna(

                doc,

                refertoCompleto.struttura,

                refertoCompleto.dati,

                refertoCompleto

            );

            // ==========================
            // FIRMA
            // ==========================

            Firma.disegna(

                doc,

                refertoCompleto.prestazione,

                refertoCompleto

            );
                        // ==========================
            // FOOTER (opzionale)
            // ==========================

            //const pages = doc.bufferedPageRange();

            //if (pages.count > 0) {

              //  for (let i = 0; i < pages.count; i++) {

                //    doc.switchToPage(i);

                  //  try {

                    //    Footer.disegna(
                      //      doc,
                        //    refertoCompleto,
                          //  i + 1,
                            //pages.count
                        //);

                    //} catch (err) {

                        // evita che un errore nel footer
                        // blocchi la generazione del PDF
                    //}

                //}

            //}

            doc.end();

        });

    }

}

module.exports = new RefertoPdf();
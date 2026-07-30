const db = require("../config/db");
const nodemailer = require("nodemailer");

// =======================
// GET configurazione categoria
// =======================
exports.getCategoria = (req, res) => {

    const { categoria } = req.params;

    try {

        const rows = db.prepare(`
            SELECT chiave, valore
            FROM configurazione_sistema
            WHERE categoria = ?
            ORDER BY chiave
        `).all(categoria);

        const dati = {};

        rows.forEach(r => {
            dati[r.chiave] = r.valore;
        });

        res.json(dati);

    } catch (err) {

        console.error(err);
        res.status(500).json({ errore: err.message });

    }

};

// =======================
// SALVA configurazione
// =======================
exports.salvaCategoria = (req, res) => {

    const { categoria } = req.params;

    try {

        const stmt = db.prepare(`
            INSERT INTO configurazione_sistema
            (categoria,chiave,valore)

            VALUES (?,?,?)

            ON CONFLICT(categoria,chiave)

            DO UPDATE SET
                valore=excluded.valore,
                aggiornato_il=CURRENT_TIMESTAMP
        `);

        const tx = db.transaction((config) => {

            Object.entries(config).forEach(([chiave,valore]) => {

                stmt.run(
                    categoria,
                    chiave,
                    valore
                );

            });

        });

        tx(req.body);

        res.json({
            success:true
        });

    } catch(err){

        console.error(err);

        res.status(500).json({
            success:false,
            errore:err.message
        });

    }

};


// =======================
// TEST SMTP
// =======================
exports.testEmail = async (req, res) => {

    try {

        const {
            host,
            porta,
            sicurezza,
            username,
            password
        } = req.body;

        const transporter = nodemailer.createTransport({

            host,

            port: Number(porta),

            secure: sicurezza === "SSL",
            requireTLS: sicurezza === "STARTTLS",

            auth: {
                user: username,
                pass: password
            }

        });

        await transporter.verify();

        res.json({
            success: true,
            messaggio: "Connessione SMTP riuscita."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            errore: err.message
        });

    }

};

// =======================
// INVIO EMAIL DI PROVA
// =======================
exports.sendTestEmail = async (req, res) => {

    try {

        const {
            host,
            porta,
            sicurezza,
            username,
            password,
            mittente_nome,
            mittente_email,
            reply_to,
            destinatario
        } = req.body;

        const transporter = nodemailer.createTransport({

            host,

            port: Number(porta),

            secure: sicurezza === "SSL",
            requireTLS: sicurezza === "STARTTLS",

            auth: {
                user: username,
                pass: password
            }

        });

        await transporter.sendMail({

            from: `"${mittente_nome}" <${mittente_email}>`,

            to: destinatario,

            replyTo: reply_to,

            subject: "Test configurazione email",

            html: `
                <h2>Configurazione SMTP completata</h2>

                <p>Questa è una email di prova inviata dal GestionalePoli.</p>

                <hr>

                <b>Host:</b> ${host}<br>
                <b>Porta:</b> ${porta}<br>
                <b>Data:</b> ${new Date().toLocaleString("it-IT")}
            `

        });

        res.json({
            success: true,
            messaggio: "Email inviata correttamente."
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            errore: err.message
        });

    }

};
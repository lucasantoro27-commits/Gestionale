const express = require("express");
const cors = require("cors");

const db = require("./config/db");

// =========================
// ROUTES
// =========================

const authRoutes = require("./routes/authRoutes");
const pazientiRoutes = require("./routes/pazientiRoutes");
const appuntamentiRoutes = require("./routes/appuntamentiRoutes");
const operatoriRoutes = require("./routes/operatoriRoutes");
const prestazioniRoutes = require("./routes/prestazioniRoutes");
const prestazioniCatalogoRoutes = require("./routes/prestazioniCatalogoRoutes");
const cartellaClinicaRoutes = require("./routes/cartellaClinicaRoutes");
const refertiRoutes = require("./routes/refertiRoutes");
const templateRefertiRoutes = require("./routes/templateRefertiRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const specialitaRoutes = require("./routes/specialitaRoutes");
const impostazioniRoutes = require("./routes/impostazioni");
const utentiRoutes = require("./routes/utentiRoutes");
const auditRoutes = require("./routes/auditRoutes");
const consensiRoutes = require("./routes/consensiRoutes");
const moduliTemplateRoutes = require("./routes/moduliTemplateRoutes");
const configurazioneRoutes = require("./routes/configurazione");

const app = express();

app.use(cors());
app.use(express.json());

const path = require("path");

// =========================
// API
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/pazienti", pazientiRoutes);

app.use("/api/operatori", operatoriRoutes);

app.use("/api/appuntamenti", appuntamentiRoutes);

app.use("/api/prestazioni", prestazioniRoutes);

app.use("/api/prestazioni-catalogo", prestazioniCatalogoRoutes);

app.use("/api/cartelle", cartellaClinicaRoutes);

app.use("/api/referti", refertiRoutes);

app.use("/api/template-referti", templateRefertiRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/specialita", specialitaRoutes);

app.use("/api/impostazioni",impostazioniRoutes);

app.use("/api/utenti", utentiRoutes);

app.use("/api/audit", auditRoutes);

app.use(
    "/uploads",
    express.static(path.join(__dirname, "../uploads"))
);

app.use("/api/moduli-template", moduliTemplateRoutes);

app.use("/api/consensi", consensiRoutes);

app.use("/api/configurazione", configurazioneRoutes);

// =========================
// ROOT
// =========================

app.get("/", (req, res) => {
    res.json({
        applicazione: "Gestionale Poliambulatorio Sociale",
        versione: "2.0.0",
        database: "SQLite",
        stato: "online"
    });
});

// =========================
// TEST DATABASE
// =========================

app.get("/api/test-db", (req, res) => {
    try {

        db.prepare("SELECT 1").get();

        res.json({
            connessione: "OK",
            database: "SQLite",
            stato: "connesso"
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            connessione: "ERRORE",
            messaggio: err.message
        });

    }
});

module.exports = app;
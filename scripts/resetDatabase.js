const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "..", "databasestudio.db"));

const tabelleDaMantenere = [
    "utenti",
    "operatori",
    "specialita",
    "prestazioni_catalogo",
    "template_referti",
    "moduli_template",
    "impostazioni_studio",
    "sqlite_sequence"
];

const tabelle = db.prepare(`
    SELECT name
    FROM sqlite_master
    WHERE type='table'
`).all();

db.exec("PRAGMA foreign_keys = OFF");

for (const t of tabelle) {

    if (tabelleDaMantenere.includes(t.name))
        continue;

    try {

        db.prepare(`DELETE FROM ${t.name}`).run();

        console.log(`✔ Svuotata: ${t.name}`);

    } catch (err) {

        console.log(`⚠ Saltata: ${t.name}`);

    }
}

try {

    db.prepare(`
        DELETE FROM sqlite_sequence
    `).run();

} catch {}

db.exec("PRAGMA foreign_keys = ON");

console.log("\n✅ Reset completato.");
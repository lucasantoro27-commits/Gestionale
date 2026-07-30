const bcrypt = require("bcryptjs");
const db = require("../config/db");

const username = "admin";
const password = "admin123";

const hash = bcrypt.hashSync(password, 10);

const esiste = db.prepare(`
    SELECT id
    FROM utenti
    WHERE username = ?
`).get(username);

if (esiste) {

    console.log("L'utente admin esiste già.");

    process.exit(0);

}

db.prepare(`
    INSERT INTO utenti
    (
        username,
        password_hash,
        ruolo,
        attivo
    )
    VALUES
    (
        ?, ?, ?, ?
    )
`).run(

    username,
    hash,
    "admin",
    1

);

console.log("================================");
console.log("Utente amministratore creato");
console.log("Username: admin");
console.log("Password: admin123");
console.log("================================");
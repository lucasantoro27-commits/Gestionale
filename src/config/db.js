const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

console.log("__dirname =", __dirname);

const dbPath = path.resolve(__dirname, "../../databasestudio.db");

console.log("dbPath =", dbPath);
console.log("Esiste =", fs.existsSync(dbPath));
console.log("Dimensione =", fs.statSync(dbPath).size);

const db = new Database(dbPath);

// Configurazione SQLite
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("temp_store = MEMORY");

module.exports = db;
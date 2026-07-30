const db = require("../config/db");

function log({
    utenteId = null,
    username = null,
    modulo = null,
    azione,
    tabella,
    recordId = null,
    dettagli = null,
    ip = null
}) {

    db.prepare(`
        INSERT INTO audit_log
        (
            utente_id,
            username,
            modulo,
            azione,
            tabella,
            record_id,
            dettagli,
            ip
        )
        VALUES
        (?,?,?,?,?,?,?,?)
    `).run(
        utenteId,
        username,
        modulo,
        azione,
        tabella,
        recordId,
        dettagli,
        ip
    );

}

module.exports = { log };
const audit = require("./audit");
const confrontaRecord = require("./diff");

async function registraAudit({
    req,
    azione,
    tabella,
    recordId = null,
    prima = null,
    dopo = null,
    dettagli = null
}) {

    let modifiche = dettagli;

    // Se non vengono passati dettagli ma esistono prima e dopo,
    // calcola automaticamente le differenze.
    if (!modifiche && prima && dopo) {
        modifiche = confrontaRecord(prima, dopo);
    }

    // Per INSERT e DELETE
    if (!modifiche) {
        modifiche = [];
    }

    await audit.log({

        utenteId: req.user?.id || null,

        username: req.user?.username || null,

        modulo: tabella,

        azione,

        tabella,

        recordId,

        dettagli: JSON.stringify(modifiche),

        ip:
            req.headers["x-forwarded-for"] ||
            req.socket?.remoteAddress ||
            req.ip ||
            null

    });

}

module.exports = registraAudit;
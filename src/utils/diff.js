function confrontaRecord(prima = {}, dopo = {}) {
    const modifiche = [];

    // Tutte le chiavi presenti nei due oggetti
    const campi = new Set([
        ...Object.keys(prima),
        ...Object.keys(dopo),
    ]);

    for (const campo of campi) {
        const valorePrima = prima[campo] ?? null;
        const valoreDopo = dopo[campo] ?? null;

        // confronto semplice
        if (String(valorePrima) !== String(valoreDopo)) {
            modifiche.push({
                campo,
                prima: valorePrima,
                dopo: valoreDopo,
            });
        }
    }

    return modifiche;
}

module.exports = confrontaRecord;
module.exports = (...ruoliConsentiti) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                errore: "Utente non autenticato."
            });

        }

        const ruolo = req.user.ruolo.toLowerCase();

        if (!ruoliConsentiti.includes(ruolo)) {

            return res.status(403).json({
                errore: "Non hai i permessi per eseguire questa operazione."
            });

        }

        next();

    };

};
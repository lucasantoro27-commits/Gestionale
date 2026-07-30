const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    console.log("AUTH HEADER:", req.headers.authorization);
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            errore: "Token mancante"
        });

    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN:", token);

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("TOKEN OK", decoded);

        req.user = decoded;

        next();

    } catch (err) {

        console.log("ERRORE JWT:", err);

        return res.status(401).json({
            errore: err.message
        });

    }

};
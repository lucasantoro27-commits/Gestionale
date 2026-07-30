const express = require("express");
const router = express.Router();

const {
    login,
    me
} = require("../controllers/authController");

const auth = require("../middleware/auth");

// Login
router.post("/login", login);

// Utente autenticato
router.get("/me", auth, me);

module.exports = router;
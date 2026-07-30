const express = require("express");
const router = express.Router();

const auditController = require("../controllers/auditController");

router.get("/", auditController.getAll);
router.get("/:id", auditController.getOne);

module.exports = router;
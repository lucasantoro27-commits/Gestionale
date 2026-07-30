const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const controller = require("../controllers/specialitaController");

const authorize = require("../middleware/authorize");

const PERMISSIONS = require("../config/permissions");

router.get("/", auth,authorize(...PERMISSIONS.specialita.view), controller. getAll);

router.get("/:id", auth,authorize(...PERMISSIONS.specialita.view), controller.getOne);

router.post("/", auth,authorize(...PERMISSIONS.specialita.create), controller.create);

router.put("/:id", auth,authorize(...PERMISSIONS.specialita.update), controller.update);

router.delete("/:id", auth,authorize(...PERMISSIONS.specialita.delete), controller.remove);

module.exports = router;
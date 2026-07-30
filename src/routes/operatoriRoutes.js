const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const authorize = require("../middleware/authorize");

const PERMISSIONS = require("../config/permissions");

const {
  getAll,
  getOne,
  create,
  update,
  remove
} = require("../controllers/operatoriController");

router.get("/", auth,authorize(...PERMISSIONS.operatori.view), getAll);
router.get("/:id", auth,authorize(...PERMISSIONS.operatori.view), getOne);
router.post("/", auth,authorize(...PERMISSIONS.operatori.create), create);
router.put("/:id", auth,authorize(...PERMISSIONS.operatori.update), update);
router.delete("/:id", auth,authorize(...PERMISSIONS.operatori.delete), remove);

module.exports = router;
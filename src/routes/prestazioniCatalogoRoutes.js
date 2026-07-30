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
} = require("../controllers/prestazioniCatalogoController");

router.get("/", auth,authorize(...PERMISSIONS.catalogoPrestazioni.view), getAll);
router.get("/:id", auth,authorize(...PERMISSIONS.catalogoPrestazioni.view), getOne);
router.post("/", auth,authorize(...PERMISSIONS.catalogoPrestazioni.create), create);
router.put("/:id", auth,authorize(...PERMISSIONS.catalogoPrestazioni.update), update);
router.delete("/:id", auth,authorize(...PERMISSIONS.catalogoPrestazioni.delete), remove);

module.exports = router;
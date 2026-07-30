const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth");

const {

  getByPaziente,

  create,

  remove

} = require("../controllers/parametriController");

router.get(
  "/:id",
  auth,
  getByPaziente
);

router.post(
  "/:id",
  auth,
  create
);

router.delete(
  "/delete/:id",
  auth,
  remove
);

module.exports = router;
const express = require("express");
const router = express.Router();
const staticController = require("../controllers/staticController");

<<<<<<< HEAD
router.get("/", (req, res, next) => {
  res.send("Welcome to Bloccit!");
});
=======
router.get("/", staticController.index);
>>>>>>> routingcontrollersview-checkpoint

module.exports = router;

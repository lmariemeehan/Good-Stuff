const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("Welcome to Bloccit, marco polo!");
});

module.exports = router;
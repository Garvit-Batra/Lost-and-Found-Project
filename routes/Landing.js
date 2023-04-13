const express = require("express");
const router = express.Router();
const redirectDash = require("./redirects/redirectDash");
router.get("/", redirectDash, function (req, res) {
  const { emailID } = req.session;
  res.render("Landing");
});
module.exports = router;

const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirectLogin");
const user = require("../models/User");
const lost = require("../models/Lost");
const found = require("../models/Found");
router.get("/Dashboard", redirectLogin, function (req, res) {
  user.findOne({ email: req.session.emailID }, function (err, data) {
    const name = data.username;
    const transformedName =
      name.substring(0, 1).toUpperCase() +
      name.substring(1, name.length).toLowerCase();
    res.render("Dashboard", { username: transformedName });
  });
});
router.get("/Dashboard/:topic", redirectLogin, function (req, res) {
  const type = req.params.topic;
  if (type === "Lost") {
    lost.find({}, function (err, results) {
      res.render("MainPage", { Heading: type, items: results });
    });
  } else if (type === "Found") {
    found.find({}, function (err, results) {
      res.render("MainPage", { Heading: type, items: results });
    });
  }
});
module.exports = router;

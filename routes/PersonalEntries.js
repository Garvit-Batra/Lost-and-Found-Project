const express = require("express");
const router = express.Router();
const user = require("../models/User");
const lost = require("../models/Lost");
const found = require("../models/Found");
const redirectLogin = require("./redirects/redirectLogin");

router.get("/MyEntries", redirectLogin, function (req, res) {
  user.findOne({ email: req.session.emailID }, function (err, results) {
    if (results) {
      lost.find({ username: results.username }, function (err, result) {
        found.find({ username: results.username }, function (err, result2) {
          result2.forEach(function (element) {
            result.push(element);
          });
          res.render("PersonalEntries", { items: result });
        });
      });
    }
  });
});
router.post("/delete", function (req, res) {
  elementID = req.body.elementID;
  elementType = req.body.elementType;
  if (elementType === "Lost") {
    lost.findByIdAndDelete({ _id: elementID }, function () {});
    res.redirect("/MyEntries");
  } else {
    found.findByIdAndDelete({ _id: elementID }, function () {});
    res.redirect("/MyEntries");
  }
});

module.exports = router;

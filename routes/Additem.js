const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirectLogin");
const user = require("../models/User");
const lost = require("../models/Lost");
const found = require("../models/Found");
router.get("/AddItem", redirectLogin, function (req, res) {
  res.render("AddItem");
});
router.post("/AddItem", function (req, res) {
  var today = new Date().toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  var time = new Date();
  var Time = time.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const T = req.body.type;
  const Title = req.body.title;
  const Desc = req.body.desc;
  const transformedTitle =
    Title.substring(0, 1).toUpperCase() +
    Title.substring(1, Title.length).toLowerCase();
  const transformedDesc =
    Desc.substring(0, 1).toUpperCase() +
    Desc.substring(1, Desc.length).toLowerCase();

  user.findOne({ email: req.session.emailID }, function (err, U) {
    const User = U.username;
    if (T === "Lost") {
      let itemL = new lost({
        title: transformedTitle,
        description: transformedDesc,
        type: req.body.type,
        date: today,
        time: Time,
        username: User,
      });
      itemL.save(function () {
        res.redirect("/Dashboard/" + T);
      });
    } else if (T === "Found") {
      let itemF = new found({
        title: transformedTitle,
        description: transformedDesc,
        type: req.body.type,
        date: today,
        time: Time,
        username: User,
      });
      itemF.save(function () {
        res.redirect("/Dashboard/" + T);
      });
    }
  });
});
module.exports = router;

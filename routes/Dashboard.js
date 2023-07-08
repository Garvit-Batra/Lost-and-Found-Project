const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirects/redirectLogin");
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
      res.render("MainPage", { Heading: type, items: results, flag: 0 });
    });
  } else if (type === "Found") {
    found.find({}, function (err, results) {
      res.render("MainPage", { Heading: type, items: results, flag: 0 });
    });
  }
});
router.post("/Dashboard/:topic", redirectLogin, function (req, res) {
  const type = req.params.topic;
  const search = req.body.search;
  const tSearch =
    search.substring(0, 1).toUpperCase() +
    search.substring(1, search.length).toLowerCase();
  if (type === "Lost") {
    lost.find(
      {
        $or: [
          { title: { $regex: ".*" + search + ".*", $options: "i" } },
          { category: tSearch },
        ],
      },
      function (err, results) {
        res.render("MainPage", { Heading: type, items: results, flag: 1 });
      }
    );
  } else if (type === "Found") {
    found.find(
      {
        $or: [
          { title: { $regex: ".*" + search + ".*", $options: "i" } },
          { category: tSearch },
        ],
      },
      function (err, results) {
        res.render("MainPage", { Heading: type, items: results, flag: 1 });
      }
    );
  }
});
router.post("/Dashboard", redirectLogin, (req, res) => {
  const search = req.body.search;
  user.find(
    { username: { $regex: ".*" + search + ".*", $options: "i" } },
    (err, results) => {
      res.render("Users", { data: results });
    }
  );
});

module.exports = router;

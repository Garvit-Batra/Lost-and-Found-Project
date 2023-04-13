const express = require("express");
const router = express.Router();
const user = require("../models/User");
const lost = require("../models/Lost");
const found = require("../models/Found");
const img = require("../models/Img");
const redirectLogin = require("./redirects/redirectLogin");

router.get("/profile", redirectLogin, (req, res) => {
  user.findOne({ email: req.session.emailID }, function (err, data) {
    const name = data.username;
    const transformedName =
      name.substring(0, 1).toUpperCase() +
      name.substring(1, name.length).toLowerCase();
    if (data) {
      lost.find({ username: data.username }, function (err, result) {
        found.find({ username: data.username }, function (err, result2) {
          img.findOne({ email: req.session.emailID }, (err, pic) => {
            res.render("Profile", {
              username: transformedName,
              itemL: result.length,
              itemF: result2.length,
              email: req.session.emailID,
              sessionEmail: req.session.emailID,
              items: [],
              image: pic,
            });
          });
        });
      });
    }
  });
});
router.get("/profile/:name", redirectLogin, function (req, res) {
  const name = req.params.name;
  user.findOne({ username: name }, function (err, data) {
    if (data) {
      if (data.email === req.session.emailID) {
        res.redirect("/profile");
      } else {
        lost.find({ username: name }, function (err, result) {
          const temp = result.length;
          found.find({ username: name }, function (err, result2) {
            result2.forEach(function (element) {
              result.push(element);
            });
            img.findOne({ email: data.email }, (error, profilePic) => {
              if (profilePic) {
                res.render("Profile", {
                  username: name,
                  itemL: temp,
                  itemF: result2.length,
                  email: data.email,
                  sessionEmail: req.session.emailID,
                  items: result,
                  image: profilePic,
                });
              } else {
                res.render("Profile", {
                  username: name,
                  itemL: temp,
                  itemF: result2.length,
                  email: data.email,
                  sessionEmail: req.session.emailID,
                  items: result,
                  image: null,
                });
              }
            });
          });
        });
      }
    }
  });
});
router.post("/deletepic", (req, res) => {
  img.findOneAndDelete({ email: req.session.emailID }, function () {});
  res.redirect("/profile");
});

module.exports = router;

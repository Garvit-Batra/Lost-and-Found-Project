const express = require("express");
const router = express.Router();
const redirectDash = require("./redirectDash");
const user = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
router.get("/Signup", redirectDash, function (req, res) {
  const { emailID } = req.session;
  const page = req.query.val;
  res.render("Signup", { Heading: page });
});
router.post("/Signup", function (req, res) {
  if (req.body.type === "Register") {
    user.findOne(
      { $or: [{ email: req.body.email }, { username: req.body.user }] },
      function (err, data) {
        if (data) {
          res.send("Email or username already exists!");
        } else {
          bcrypt.genSalt(saltRounds, function (err, salt) {
            bcrypt.hash(req.body.password, salt, function (err, hash) {
              let user1 = new user({
                username: req.body.user,
                email: req.body.email,
                password: hash,
              });
              user1.save(function () {
                req.session.emailID = req.body.email;
                res.redirect("/Dashboard");
              });
            });
          });
        }
      }
    );
  } else if (req.body.type === "Login") {
    user.findOne({ email: req.body.email }, function (err, results) {
      if (results) {
        bcrypt.compare(
          req.body.password,
          results.password,
          function (err, result) {
            if (result) {
              req.session.emailID = req.body.email;
              res.redirect("/Dashboard");
            } else {
              res.send("Error in email or password");
            }
          }
        );
      } else {
        res.send("Error in email or password");
      }
    });
  }
});
module.exports = router;

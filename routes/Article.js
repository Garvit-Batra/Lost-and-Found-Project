const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirectLogin");
const lost = require("../models/Lost");
const found = require("../models/Found");
router.get("/article/:topic", redirectLogin, function (req, res) {
  const post = req.params.topic;
  lost.findOne({ _id: post }, function (err, result) {
    if (result) {
      return res.render("Article", {
        title: result.title,
        content: result.description,
        owner: result.username,
      });
    }
  });
  found.findOne({ _id: post }, function (err, result) {
    if (result) {
      return res.render("Article", {
        title: result.title,
        content: result.description,
        owner: result.username,
      });
    }
  });
});
module.exports = router;

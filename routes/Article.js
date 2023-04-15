const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirects/redirectLogin");
const lost = require("../models/Lost");
const found = require("../models/Found");
const img = require("../models/Img");
router.get("/article/:topic", redirectLogin, function (req, res) {
  const post = req.params.topic;
  lost.findOne({ _id: post }, function (err, result) {
    if (result) {
      img.findOne({ email: result.email }, function (err, pic) {
        return res.render("Article", {
          title: result.title,
          content: result.description,
          owner: result.username,
          image: result,
          date: result.date,
          time: result.time,
          category: result.category,
          image1: pic,
        });
      });
    }
  });
  found.findOne({ _id: post }, function (err, result) {
    if (result) {
      img.findOne({ email: result.email }, function (err, pic) {
        return res.render("Article", {
          title: result.title,
          content: result.description,
          owner: result.username,
          image: result,
          date: result.date,
          time: result.time,
          category: result.category,
          image1: pic,
        });
      });
    }
  });
});
module.exports = router;

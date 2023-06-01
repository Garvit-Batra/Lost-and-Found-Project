const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirects/redirectLogin");
const img = require("../models/Img");
const user = require("../models/User");
const chat = require("../models/Chats");

router.get("/chats", redirectLogin, (req, res) => {
  chat.find(
    {
      $or: [{ user1: req.session.username }, { user2: req.session.username }],
    },
    (err, chats) => {
      if (chats) {
        let data = [];
        chats.forEach(function (element) {
          if (element.user1 === req.session.username) {
            data.push(element.user2);
          } else {
            data.push(element.user1);
          }
        });
        res.render("Chats", { data: data });
      }
    }
  );
});
module.exports = router;

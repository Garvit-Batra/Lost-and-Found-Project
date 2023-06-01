const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirects/redirectLogin");
const img = require("../models/Img");
const user = require("../models/User");
const chat = require("../models/Chats");
const message = require("../models/Message");

router.get("/message/:receiver", redirectLogin, function (req, res) {
  const receiver = req.params.receiver;
  user.findOne({ username: receiver }, (err, result) => {
    if (result) {
      message.find(
        {
          $or: [
            {
              $and: [{ sender: req.session.username }, { receiver: receiver }],
            },
            {
              $and: [{ sender: receiver }, { receiver: req.session.username }],
            },
          ],
        },
        (err, msgs) => {
          img.findOne({ name: receiver }, (error, pic) => {
            if (pic) {
              res.render("Message", {
                receiver: receiver,
                image: pic,
                msgs: msgs,
              });
            } else {
              res.render("Message", {
                receiver: receiver,
                image: null,
                msgs: msgs,
              });
            }
          });
        }
      );
    } else {
      res.send("User does not exist");
    }
  });
});
router.post("/message/:receiver", (req, res) => {
  const receiver = req.params.receiver;
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
  let msg = new message({
    sender: req.session.username,
    receiver: receiver,
    message: req.body.message,
    time: Time,
    date: today,
  });
  chat.findOne(
    {
      $or: [
        { $and: [{ user1: req.session.username }, { user2: receiver }] },
        { $and: [{ user2: req.session.username }, { user1: receiver }] },
      ],
    },
    (err, cht) => {
      if (cht) {
      } else {
        let cht = new chat({
          user1: req.session.username,
          user2: receiver,
        });
        cht.save();
      }
    }
  );
  msg.save(function () {
    res.redirect(`/message/${receiver}`);
  });
});
module.exports = router;

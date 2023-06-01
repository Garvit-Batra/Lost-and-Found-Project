const express = require("express");
const router = express.Router();
const redirectLogin = require("./redirects/redirectLogin");
const user = require("../models/User");
const lost = require("../models/Lost");
const found = require("../models/Found");
var fs = require("fs");
var path = require("path");
const multer = require("multer");
const fsExtra = require("fs-extra");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "routes/compose");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

router.get("/AddItem", redirectLogin, function (req, res) {
  res.render("AddItem");
});
router.post("/AddItem", upload.single("image1"), function (req, res) {
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
  const Category = req.body.category;
  const transformedCategory =
    Category.substring(0, 1).toUpperCase() +
    Category.substring(1, Category.length).toLowerCase();
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
        email: req.session.emailID,
        name: req.body.name,
        img1: {
          data: fs.readFileSync(
            path.join(__dirname + "/compose/" + req.file.filename)
          ),
          contentType: "image/png",
        },
        category: transformedCategory,
      });
      itemL.save(function () {
        fsExtra.emptyDirSync(__dirname + "/compose");
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
        email: req.session.emailID,
        name: req.body.name,
        img1: {
          data: fs.readFileSync(
            path.join(__dirname + "/compose/" + req.file.filename)
          ),
          contentType: "image/png",
        },
        category: transformedCategory,
      });
      itemF.save(function () {
        fsExtra.emptyDirSync("compose");
        res.redirect("/Dashboard/" + T);
      });
    }
  });
});
module.exports = router;

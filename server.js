require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const MongoStore = require("connect-mongo");
var fs = require("fs");
var path = require("path");
var multer = require("multer");
const fsExtra = require("fs-extra");
const connectToMongo = require("./db");
const img = require("./models/Img");
const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

connectToMongo();
const connection =
  "mongodb+srv://Garvit:" +
  process.env.PASSWORD +
  "@cluster0.6cndibr.mongodb.net/LostAndFound";
const sessionStore = new MongoStore({
  mongoUrl: connection,
  dbName: "LostAndFound",
  collectionName: "sessions",
  autoRemove: "native",
});
app.use(
  session({
    name: "sid",
    resave: false,
    saveUninitialized: false,
    secret: process.env.SECRET,
    store: sessionStore,
  })
);
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

app.get("/profile", require("./routes/Profile"));
app.get("/", require("./routes/Landing"));
app.get("/Signup", require("./routes/Signup"));
app.get("/AddItem", require("./routes/Additem"));
app.get("/Dashboard", require("./routes/Dashboard"));
app.get("/Dashboard/:topic", require("./routes/Dashboard"));
app.get("/article/:topic", require("./routes/Article"));
app.get("/profile/:name", require("./routes/Profile"));
app.get("/MyEntries", require("./routes/PersonalEntries"));
app.get("/about", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/AddItem", require("./routes/Additem"));
app.post("/Signup", require("./routes/Signup"));
app.post("/delete", require("./routes/PersonalEntries"));
app.post("/deletepic", require("./routes/Profile"));

app.post("/changepic", upload.single("image"), (req, res, next) => {
  img.findOne({ email: req.session.emailID }, (err, item) => {
    if (item) {
      fsExtra.emptyDirSync("uploads");
    } else if (req.file.filename) {
      let obj = new img({
        name: req.body.name,
        email: req.session.emailID,
        img: {
          data: fs.readFileSync(
            path.join(__dirname + "/uploads/" + req.file.filename)
          ),
          contentType: "image/png",
        },
      });
      obj.save(function () {
        fsExtra.emptyDirSync("uploads");
        res.redirect("/profile");
      });
    }
  });
});
app.post("/logout", function (req, res) {
  req.session.destroy(function () {
    res.clearCookie("sid");
    res.redirect("/");
  });
});
app.listen(PORT, function () {
  console.log("Server started at 3000");
});

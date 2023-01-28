require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const saltRounds = 10;

const PORT = process.env.PORT || 3000;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://Garvit:" +
    process.env.PASSWORD +
    "@cluster0.6cndibr.mongodb.net/LostAndFound",
  { useNewUrlParser: true }
);
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

const lostAndFoundSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  date: String,
  time: String,
  username: String,
});
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const lost = mongoose.model("lost", lostAndFoundSchema);
const found = mongoose.model("found", lostAndFoundSchema);
const user = mongoose.model("user", userSchema);

const redirectLogin = (req, res, next) => {
  if (!req.session.emailID) {
    res.redirect("/Signup?val=Login");
  } else {
    next();
  }
};
const redirectDash = (req, res, next) => {
  if (req.session.emailID) {
    res.redirect("/Dashboard");
  } else {
    next();
  }
};

app.get("/", redirectDash, function (req, res) {
  const { emailID } = req.session;
  res.render("Landing");
});
app.get("/Signup", redirectDash, function (req, res) {
  const { emailID } = req.session;
  const page = req.query.val;
  res.render("Signup", { Heading: page });
});

app.get("/AddItem", redirectLogin, function (req, res) {
  res.render("AddItem");
});
app.get("/Dashboard", redirectLogin, function (req, res) {
  user.findOne({ email: req.session.emailID }, function (err, data) {
    const name = data.username;
    const transformedName =
      name.substring(0, 1).toUpperCase() +
      name.substring(1, name.length).toLowerCase();
    res.render("Dashboard", { username: transformedName });
  });
});
app.get("/Dashboard/:topic", redirectLogin, function (req, res) {
  const type = req.params.topic;
  if (type === "Lost") {
    lost.find({}, function (err, results) {
      res.render("MainPage", { Heading: type, items: results });
    });
  } else if (type === "Found") {
    found.find({}, function (err, results) {
      res.render("MainPage", { Heading: type, items: results });
    });
  }
});
app.get("/article/:topic", redirectLogin, function (req, res) {
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

app.post("/AddItem", function (req, res) {
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

app.post("/Signup", function (req, res) {
  if (req.body.type === "Register") {
    user.findOne({ email: req.body.email }, function (err, data) {
      if (data) {
        res.send("Email already exists!");
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
    });
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

app.get("/MyEntries", redirectLogin, function (req, res) {
  user.findOne({ email: req.session.emailID }, function (err, results) {
    if (results) {
      lost.find({ username: results.username }, function (err, result) {
        found.find({ username: results.username }, function (err, result2) {
          result2.forEach(function (element) {
            result.push(element);
          });
          res.render("PersonalEntries", { items: result });
        });
      });
    }
  });
});

app.post("/delete", redirectLogin, function (req, res) {
  elementID = req.body.elementID;
  elementType = req.body.elementType;
  if (elementType === "Lost") {
    lost.findByIdAndDelete({ _id: elementID }, function () {});
    res.redirect("/MyEntries");
  } else {
    found.findByIdAndDelete({ _id: elementID }, function () {});
    res.redirect("/MyEntries");
  }
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

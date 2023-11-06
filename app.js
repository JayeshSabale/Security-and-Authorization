require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");
const notifier = require("node-notifier");

const app = express();

var item = [];
var hiddenSecret = "";

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String, 
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {

  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});


app.get("/register", function (req, res) {
    notifier.notify({
      title: "Welcome!",
      message: "For registration enter your email and password"
    });
  res.render("register");
  
});

app.get("/submit", function (req, res) {
  res.render("submit" , {store : hiddenSecret});
});

app.get("/logout", function (req, res) {
  notifier.notify({
    title: "Log Out!",
    message: "You have successfully logged out of the application."
  });
  res.redirect("/");
});

app.post("/register", function (req, res) {

  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password),
  });
  newUser
    .save()
    .then(function () {
      res.render("login");
     
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/login", function (req, res) {
 

  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username })
    .then(function (foundUser) {
      if (foundUser.password === password) {
        res.render("secrets");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/submit", (req, res) => {

  var hiddenSecret = req.body.secret;

  item.push(hiddenSecret);

  res.render("submit", { store: item });

});

app.listen(3000, function () {
  console.log("Server is running on port number 3000");
});

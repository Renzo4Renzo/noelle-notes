const express = require("express");
const router = express.Router();

const User = require("../models/User");
const passport = require("passport");

router.get("/users/login", (request, response) => {
  response.render("users/login");
});

router.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/notes",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
);

router.get("/users/register", (request, response) => {
  response.render("users/register");
});

router.post("/users/register", async (request, response) => {
  try {
    const { name, email, password, confirm_password } = request.body;
    const errors = [];
    if (!name || name.replace(/\s/g, "").length == 0) {
      errors.push({ errorMessage: "Please write your name!" });
    }
    if (!email || email.replace(/\s/g, "").length == 0) {
      errors.push({ errorMessage: "Please write your email!" });
    }
    if (!password || password.replace(/\s/g, "").length == 0) {
      errors.push({ errorMessage: "Please write your password!" });
    } else if (password.length < 6) {
      errors.push({ errorMessage: "Password must be at least 6 characters! " });
    }
    if (!confirm_password || confirm_password.replace(/\s/g, "").length == 0) {
      errors.push({ errorMessage: "Please write your password confirmation!" });
    } else if (password != confirm_password) {
      errors.push({ errorMessage: "Passwords don't match!" });
    }
    if (errors.length > 0) {
      response.render("users/register", { errors, name, email, password, confirm_password });
    } else {
      const userEmail = await User.findOne({ email: email });
      if (userEmail) {
        request.flash("failure_message", email + " is already registered!");
        response.redirect("/users/register");
      } else {
        const newUser = new User({ name, email, password });
        newUser.password = await newUser.encryptPassword(password);
        newUser.save();
        request.flash("success_message", "User created successfully!");
        response.redirect("/users/login");
      }
    }
  } catch (error) {
    let errorMessage = error.toString();
    if (error.name == "MongooseServerSelectionError" || error.name == "MongooseError") {
      errorMessage = "Can't establish connection with database! Try again later!";
    }
    response.render("users/register", { errorMessage });
  }
});

router.get("/users/logout", (request, response) => {
  request.logout();
  response.redirect("/");
});

module.exports = router;

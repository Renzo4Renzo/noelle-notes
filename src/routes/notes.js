const express = require("express");
const router = express.Router();

const Note = require("../models/Note");
const { isAuthenticated } = require("../helpers/auth");

router.get("/notes/add", isAuthenticated, (request, response) => {
  response.render("notes/note-add");
});

router.post("/notes/create", isAuthenticated, (request, response) => {
  const { title, description } = request.body;
  const errors = [];
  if (!title || title.replace(/\s/g, "").length == 0) {
    errors.push({ errorMessage: "Please write a title!" });
  }
  if (!description || description.replace(/\s/g, "").length == 0) {
    errors.push({ errorMessage: "Please write a description!" });
  }
  if (errors.length > 0) {
    response.render("notes/note-add", { errors });
  } else {
    const newNote = new Note({ title, description });
    newNote.user = request.user.id;
    newNote.save((error, noteStored) => {
      if (error /*&& error.name == "MongooseError"*/) {
        request.flash("failure_message", "The note was not created!");
        response.redirect("/notes");
      } else {
        request.flash("success_message", "Note added successfully!");
        response.redirect("/notes");
      }
    });
  }
});

router.get("/notes", isAuthenticated, async (request, response) => {
  await Note.find({ user: request.user.id })
    .sort({ date: "desc" })
    .lean()
    .exec((error, notes) => {
      if (error /*&& error.name == "MongooseServerSelectionError"*/) {
        let errorMessage = "Can't establish connection with database! Try again later!";
        response.render("notes/note-list", { errorMessage });
      } else {
        response.render("notes/note-list", { notes });
      }
    });
});

router.get("/notes/edit/:id", isAuthenticated, (request, response) => {
  Note.findById(request.params.id)
    .lean()
    .exec((error, note) => {
      if (error /*&& error.name == "MongooseServerSelectionError"*/) {
        response.redirect("/notes");
      } else {
        response.render("notes/note-edit", { note });
      }
    });
});

router.put("/notes/note-edit/:id", isAuthenticated, (request, response) => {
  const { title, description } = request.body;
  const errors = [];
  if (!title || title.replace(/\s/g, "").length == 0) {
    errors.push({ errorMessage: "Please write a title!" });
  }
  if (!description || description.replace(/\s/g, "").length == 0) {
    errors.push({ errorMessage: "Please write a description!" });
  }
  if (errors.length > 0) {
    Note.findById(request.params.id)
      .lean()
      .exec((error, note) => {
        if (error /*&& error.name == "MongooseServerSelectionError"*/) {
          response.redirect("/notes");
        } else {
          response.render("notes/note-edit", { note, errors });
        }
      });
  } else {
    Note.findByIdAndUpdate(request.params.id, { title, description }, { new: true }, (error, note) => {
      if (error /*&& error.name == "MongooseServerSelectionError"*/) {
        request.flash("failure_message", "The note was not updated!");
        response.redirect("/notes");
      } else {
        request.flash("success_message", "Note updated successfully!");
        response.redirect("/notes");
      }
    });
  }
});

router.delete("/notes/delete/:id", isAuthenticated, (request, response) => {
  Note.findByIdAndDelete(request.params.id, (error, note) => {
    if (error /*&& error.name == "MongooseServerSelectionError"*/) {
      request.flash("failure_message", "The note was not deleted!");
      response.redirect("/notes");
    } else {
      request.flash("success_message", "Note deleted successfully!");
      response.redirect("/notes");
    }
  });
});

module.exports = router;

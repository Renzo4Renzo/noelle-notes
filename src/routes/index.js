const express = require("express");
const router = express.Router();

router.get("/", (request, result) => {
  result.render("index/index");
});

router.get("/about", (request, result) => {
  result.render("index/about");
});

module.exports = router;

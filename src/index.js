const express = require("express");
const path = require("path");
const expressHandlebards = require("express-handlebars");
const methodOverride = require("method-override");
const expressSession = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");

//Initializations
const app = express();
require("./database");
require("./config/passport");

//Settings
app.set("port", process.env.PORT || 3003);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  expressHandlebards({
    defaultLayout: "main",
    layoutDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  expressSession({
    secret: "secret123",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global Variables
app.use((request, response, next) => {
  response.locals.success_message = request.flash("success_message");
  response.locals.failure_message = request.flash("failure_message");
  response.locals.error = request.flash("error");
  response.locals.user = request.user || null;
  next();
});

//Routes
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

//Static Fields
app.use(express.static(path.join(__dirname, "public")));

//Server is listenning
app.listen(app.get("port"), () => {
  console.log("Server on port", app.get("port"));
});

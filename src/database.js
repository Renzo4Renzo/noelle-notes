const mongoose = require("mongoose");
const connectionURL = "mongodb://localhost:27017/notes-app-db";

mongoose
  .connect(connectionURL, { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true })
  .then((db) => console.log("¡Successful Connection with DB!"))
  .catch((error) => console.error("Connection error: " + error.toString()));

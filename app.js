const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const notesRouter = require("./routes/Notes");
const usersRouter = require("./routes/User");

const DB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@todo.yobq0.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
// middlewares for CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/notes", notesRouter);
app.use("/api/users", usersRouter);
app.use((req, res) => {
  throw new Error("Route not found");
});
app.use((error, req, res, next) => {
  res.status(error.code || 500);
  res.json({ message: error.message || "Unknown error occured" });
});

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    app.listen(process.env.PORT || 3001);
  })
  .catch(err => {
    console.log(err);
  });

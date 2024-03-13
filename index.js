const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
var session = require("express-session");
require("dotenv").config();

const DATABASE_URL = process.env.URL_STRING;
const app = express();
const authentication = require("./routes/authentication");
const buses = require("./routes/buses");
const seats = require("./routes/seat");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
});

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 60000 },
  })
);

app.use(bodyParser.json());
app.use("/users", authentication);
app.use("/api", buses);
app.use("/api", seats);

app.use(express.static("client/build"));

const uploadDirectory = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory);
}

mongoose
  .connect(DATABASE_URL)
  .then(() => app.listen(3001))
  .catch(() => console.log("Couldn't connecte to MongoDB"));

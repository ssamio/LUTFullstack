require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
require("./passport-config")(passport);

const mongoDB = "mongodb://localhost:27017/expenseTracker";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error!"));

var authRouter = require("./routes/auth");
var apiRouter = require("./routes/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());

app.use(express.static(path.resolve("..", "client", "build")));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) =>
    res.sendFile(path.resolve("..", "client", "build", "index.html")),
  );
}

if (process.env.NODE_ENV === "development") {
  var corsOptions = {
    origin: "*", // Allow requests from any origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS", // Allowed methods
    allowedHeaders:
      "Origin, X-Requested-With, Content-Type, Accept, Authorization", // Allowed headers
    optionsSuccessStatus: 200, // Response status for successful OPTIONS request
  };
}

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use("/auth", authRouter);
app.use("/api", apiRouter);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;

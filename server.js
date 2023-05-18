const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const connectDB = require("./config/connect");
const mongoose = require("mongoose");
const authUser = require("./routes/auth")
// require("dotenv").config();


const app = express();

// // var corsOptions = {
// //   origin: "http://localhost:8081"
// // };

app.use(cors());

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

//generating secret key
const secretKey = crypto.randomBytes(32).toString("hex");
app.use(
  cookieSession({
    name: "bezkoder-session",
    secret: secretKey,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  })
);

//status confirmation
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    status: errorStatus,
    message: errorMessage,
    success: false,
    stack: err.stack,
  });
});

//Mongo Connection
connectDB();
app.use('/auth', authUser)

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to API serices application." });
});

// // set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

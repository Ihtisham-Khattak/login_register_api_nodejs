const express = require("express");
const cors = require("cors");
const cookieSession = require("cookie-session");
const crypto = require("crypto");
const connectDB = require("./config/connect");
const authUser = require("./routes/auth")
// require("dotenv").config();


const app = express();
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


//Mongo Connection
connectDB();
app.post('/auth', authUser)

// set port, listen for requests
const PORT = process.env.PORT || 8010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app
// require("dotenv").config();
const mongoose = require("mongoose");


const connectDB = async () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.Promise = global.Promise;

    // connect to the database
    mongoose.connect("mongodb+srv://authAPi:OlHnBmFEYSkTUw1N@authapi.emapcs3.mongodb.net/");

    // When successfully connected
    mongoose.connection.on("connected", () => {
      console.log("Connection to database established successfully");
    });

    // If the connection throws an error
    mongoose.connection.on("error", (err) => {
      console.error(`Error connecting to database: ${err}`);
    });

    // When the connection is disconnected
    mongoose.connection.on("disconnected", () => {
      console.log("Database disconnected");
    });
  } catch (error) {
    console.log("error");
  }
};

module.exports = connectDB;

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userScheme = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      max: 20,
      min: 5,
    },

    lastName: {
      type: String,
      require: true,
      max: 20,
      min: 5,
    },

    userName: {
      type: String,
      require: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      lowercase: true,
      unique: true,
    },
    hash_password: {
      type: String,
      require: true,
    },
    profilePicture: {
      type: String,
    },
  },
  { timestamps: true }
);

//to get fullname
userScheme.virtual("fullname").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userScheme.method("authenticate", async function (password) {
  try {
    return await bcrypt.compare(password, this.hash_password);
  } catch (error) {
    throw error;
  }
});

module.exports = mongoose.model("User", userScheme);

const { StatusCodes } = require("http-status-codes");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

// Sign Up
const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "Please Provide Required Information",
    });
  }

  const hash_password = await bcrypt.hash(password, 10);

  const userData = {
    firstName,
    lastName,
    email,
    hash_password,
  };

  const user = await User.findOne({ email });
  if (user) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User already registered",
    });
  } else {
    User.create(userData).then((data, err) => {
      if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
      else
        res
          .status(StatusCodes.CREATED)
          .json({ message: "User created Successfully" });
    });
  }
};

// Sign In user
const signIn = async (req, res, next) => {
  try {

    const user = await User.findOne({ email: req.body.email });

    if (user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User already exist" });
    }

    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User does not exist..!",
      });
    }

    // Check if the provided password matches the user's password
    const isPasswordValid = await user.authenticate(req.body.password);
    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Incorrect password",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    // Return user data and token
    const { _id, firstName, lastName, email, userName } = user;
    res.status(StatusCodes.OK).json({
      token,
      user: { _id, firstName, lastName, email, userName },
    });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "No Data" });
  }
};

module.exports = { signUp, signIn };

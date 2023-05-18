const { StatusCodes } = require("http-status-codes");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
// const createError = require("../utils/Error");

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

  // db.users.deleteMany({ userName: null })
};

// Sign In user
const signIn = async (req, res, next) => {
  try {
    
    // if (!req.body.email || !req.body.password) {
    //   return res.status(StatusCodes.BAD_REQUEST).json({
    //     message: "Please enter email and password",
    //   });
    // }

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

// const signIn = async (req, res, next) => {
//   try {
//     if (!req.body.email || !req.body.password) {
//       res.status(StatusCodes.BAD_REQUEST).json({
//         message: "Please enter email and password",
//       });
//     }

//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       res.status(StatusCodes.BAD_REQUEST).json({
//         message: "User does not exist..!",
//       });
//     }
//     // if (user.authenticate(req.body.password)) {
//     //   const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//     //     expiresIn: "30d",
//     //   });
//     //   const { _id, firstName, lastName, email, fullName } = user;
//     //   res.status(StatusCodes.OK).json({
//     //     token,
//     //     user: { _id, firstName, lastName, email, fullName },
//     //   });
//     // } else {
//     //   res.status(StatusCodes.UNAUTHORIZED).json({
//     //     message: "Something went wrong!",
//     //   });
//     // }
//     // } else {
//     //   res.status(StatusCodes.BAD_REQUEST).json({
//     //     message: "User does not exist..!",
//     //   });
//     // }
//   } catch (error) {
//     res.status(StatusCodes.BAD_REQUEST).json({ error });
//   }
// };

// const signIn = async (req, res, next) => {
//   try {
//     if (!req.body.email || !req.body.password) {
//       res.status(StatusCodes.BAD_REQUEST).json({
//         message: "Please enter email and password",
//       });
//     }

//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return next((404, "User not Found"));
//     }

//     const isPassword = await bcrypt.compare(req.body.password, user.password);
//     if (!isPassword) {
//       return next(createError(404, "Password is not matched!"));
//     }

//     const token = jwt.sign(
//       //   { id: user._id, isAdmin: user.isAdmin, isDoctor: user.isDoctor },
//       { id: user._id },
//       process.env.JWT
//     );
//     const { password, ...others } = user._doc;
//     res
//       .cookie("access_token", token, {
//         httpOnly: true,
//       })
//       .status(200)
//       .json({ details: { ...others } });
//   } catch (err) {
//     next(err);
//   }
// };
module.exports = { signUp, signIn };

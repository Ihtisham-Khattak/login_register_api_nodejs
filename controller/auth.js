const { StatusCodes } = require("http-status-codes");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");

// Sign Up
// const signUp = async (req, res) => {
//   const { firstName, lastName, email, password } = req.body;

//   if (!firstName || !lastName || !email || !password) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "Please Provide Required Information",
//     });
//   }

//   const hash_password = await bcrypt.hash(password, 10);

//   const userData = {
//     firstName,
//     lastName,
//     email,
//     hash_password,
//   };

//   const user = await User.findOne({ email });
//   if (user) {
//     return res.status(StatusCodes.BAD_REQUEST).json({
//       message: "User already registered",
//     });
//   } else {
//     User.create(userData).then((data, err) => {
//       if (err) res.status(StatusCodes.BAD_REQUEST).json({ err });
//       else
//         res
//           .status(StatusCodes.CREATED)
//           .json({ message: "User created Successfully" });
//     });
//   }
// };

// Sign In user
// const signIn = async (req, res, next) => {
//   try {

//     const user = await User.findOne({ email: req.body.email });

//     if (user) {
//       return res
//         .status(StatusCodes.BAD_REQUEST)
//         .json({ message: "User already exist" });
//     }

//     if (!user) {
//       return res.status(StatusCodes.BAD_REQUEST).json({
//         message: "User does not exist..!",
//       });
//     }

//     // Check if the provided password matches the user's password
//     const isPasswordValid = await user.authenticate(req.body.password);
//     if (!isPasswordValid) {
//       return res.status(StatusCodes.UNAUTHORIZED).json({
//         message: "Incorrect password",
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "30d",
//     });

//     // Return user data and token
//     const { _id, firstName, lastName, email, userName } = user;
//     res.status(StatusCodes.OK).json({
//       token,
//       user: { _id, firstName, lastName, email, userName },
//     });
//   } catch (error) {
//     res.status(StatusCodes.BAD_REQUEST).json({ error: "No Data" });
//   }
// };

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      User.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      console.log("user already registered");
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Invalid Password!" });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
      });
    });
};

module.exports = { signUp, signIn };

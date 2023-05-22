const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controller/auth");
const {  
  isRequestValidated,
  validateSignUpRequest,
  validateSignInRequest,
} = require("../utils/auth");


router.route("/signin").post(validateSignInRequest, isRequestValidated, signIn);


router.route("/signup").post(validateSignUpRequest, isRequestValidated, signUp);


module.exports = router;

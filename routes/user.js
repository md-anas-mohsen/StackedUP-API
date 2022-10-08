const router = require("express").Router();
const userService = require("../services/userService");
// const validator = require("express-joi-validation").createValidator({});
const userValidatorSchema = require("../validators/userValidatorSchema");
const SchemaValidator = require("../middlewares/SchemaValidator");
const { isAuthenticatedUser } = require("../middlewares/auth");
const validator = new SchemaValidator();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Users route",
  });
});

router.post(
  "/register",
  validator.body(userValidatorSchema.registerUserRequestModel),
  userService.registerUser
);

router.post(
  "/login",
  validator.body(userValidatorSchema.loginUserRequestModel),
  userService.loginUser
);

router.post(
  "/refresh-token",
  validator.body(userValidatorSchema.refreshUserTokenRequestModel),
  userService.refreshToken
);

router.post(
  "/",
  isAuthenticatedUser("admin"),
  validator.body(userValidatorSchema.createUserRequestModel),
  userService.createUser
);

router.get("/me", isAuthenticatedUser(), userService.getUserProfile);

module.exports = router;

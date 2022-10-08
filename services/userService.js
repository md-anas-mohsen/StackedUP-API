const User = require("../models/user");
const { setAuthToken, verifyRefreshToken } = require("../utils/authToken");
const MESSAGES = require("../constants/messages");

const userService = {
  registerUser: async (req, res, next) => {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({
      email,
    });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: MESSAGES.EMAIL_ALREADY_REGISTERED,
      });
    }

    let user;
    try {
      user = await User.create({
        name,
        email,
        password,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
        message: MESSAGES.SERVER_ERROR,
      });
    }

    setAuthToken(user, 201, req, res, MESSAGES.REGISTRATION_SUCCESS);
  },
  loginUser: async (req, res, next) => {
    const { email, password } = req.body;

    let user;
    try {
      user = await User.findOne({
        email,
      }).select("+password");
    } catch (error) {
      return res.status(500).json({
        success: false,
        error,
        message: MESSAGES.SERVER_ERROR,
      });
    }

    try {
      const passwordIsCorrect = await user.comparePassword(password);

      if (!passwordIsCorrect) {
        return res.status(200).json({
          success: false,
          message: MESSAGES.INCORRECT_PASSWORD,
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message,
        message: MESSAGES.SERVER_ERROR,
      });
    }

    await setAuthToken(user, 200, req, res, MESSAGES.LOGIN_SUCCESS);
  },
  getUserProfile: async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user,
    });
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    try {
      const userId = await verifyRefreshToken(refreshToken);

      const user = await User.findById(userId);

      await setAuthToken(user, 200, req, res);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: MESSAGES.INVALID_REFRESH_TOKEN,
      });
    }
  },
  createUser: async (req, res) => {
    const { name, email, role, password } = req.body;

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    try {
      const newUser = await User.create({
        name,
        email,
        role,
        password,
      });

      return res.status(200).json({
        success: true,
        message: MESSAGES.USER_CREATION_SUCCESS,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  },
};

module.exports = userService;

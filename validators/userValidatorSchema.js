const Joi = require("joi");

const userValidatorSchema = {
  registerUserRequestModel: Joi.object({
    name: Joi.string().max(25).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
  }),
  loginUserRequestModel: Joi.object({
    password: Joi.string().required(),
    email: Joi.string().email().required(),
  }),
  refreshUserTokenRequestModel: Joi.object({
    refreshToken: Joi.string().required(),
  }),
  createUserRequestModel: Joi.object({
    name: Joi.string().max(25).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "admin"),
  }),
};

module.exports = userValidatorSchema;

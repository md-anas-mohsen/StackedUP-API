const Joi = require("joi");

const productValidatorSchema = {
  createProductRequestModel: Joi.object({
    name: Joi.string().max(90).required(),
    price: Joi.number().required(),
    description: Joi.string().max(200).required(),
    images: Joi.array()
      .items(Joi.object().keys({ url: Joi.string().required() }))
      .required(),
    categories: Joi.array().items(Joi.string()).required(),
    stock: Joi.number().required(),
  }),
  updateProductRequestModel: Joi.object({
    name: Joi.string().max(90).required(),
    price: Joi.number().required(),
    description: Joi.string().max(200).required(),
    images: Joi.array()
      .items(Joi.object().keys({ url: Joi.string().required() }))
      .optional(),
    categories: Joi.array().items(Joi.string()).required(),
    stock: Joi.number().required(),
  }),
};

module.exports = productValidatorSchema;

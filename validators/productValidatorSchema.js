const Joi = require("joi");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");

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
  productListingRequestModel: Joi.object({
    keyword: Joi.string().allow("").trim().optional(),
    page: Joi.number().empty("").default(1).optional(),
    limit: Joi.number().empty("").default(20).max(500).optional(),
    priceGTE: Joi.number().empty("").default(1).optional(),
    priceLTE: Joi.number().empty("").default(1).optional(),
    category: Joi.string().allow("").trim().optional(),
    orderBy: Joi.string().allow("").trim().optional(),
    direction: Joi.string()
      .valid(ORDER_BY_DIRECTIONS.ASC, ORDER_BY_DIRECTIONS.DESC)
      .optional(),
  }),
  createProductReviewRequestModel: Joi.object({
    comment: Joi.string().max(90).required(),
    rating: Joi.number().min(1).max(5).required(),
  }),
  deleteProductReviewRequestModel: Joi.object({
    productId: Joi.string().required(),
    reviewId: Joi.string().required(),
  }),
  getProductReviewsRequestModel: Joi.object({
    productId: Joi.string().required(),
  }),
};

module.exports = productValidatorSchema;

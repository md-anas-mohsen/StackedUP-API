const Joi = require("joi");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");

const categoryValidatorSchema = {
  createCategoryRequestModel: Joi.object({
    name: Joi.string().max(90).required(),
    discount: Joi.number().optional(),
  }),
  updateCategoryRequestModel: Joi.object({
    name: Joi.string().max(90).required(),
    discount: Joi.number().optional(),
  }),
  categoryListingRequestModel: Joi.object({
    keyword: Joi.string().allow("").trim().optional(),
    page: Joi.number().empty("").default(1).optional(),
    limit: Joi.number().empty("").default(20).max(500).optional(),
    orderBy: Joi.string().allow("").trim().optional(),
    direction: Joi.string()
      .valid(ORDER_BY_DIRECTIONS.ASC, ORDER_BY_DIRECTIONS.DESC)
      .optional(),
  }),
};

module.exports = categoryValidatorSchema;

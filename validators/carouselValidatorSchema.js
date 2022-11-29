const Joi = require("joi");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");

const carouselValidatorSchema = {
  createCarouselSlideRequestModel: Joi.object({
    title: Joi.string().max(90).required(),
    description: Joi.string().max(90).required(),
    image: Joi.required(),
    link: Joi.string().max(90).required(),
  }),
  updateCarouselSlideRequestModel: Joi.object({
    title: Joi.string().max(90).required(),
    description: Joi.string().max(90).required(),
    image: Joi.required(),
    link: Joi.string().max(90).required(),
  }),
  carouselSlidesListingRequestModel: Joi.object({
    keyword: Joi.string().allow("").trim().optional(),
    page: Joi.number().empty("").default(1).optional(),
    limit: Joi.number().empty("").default(20).max(500).optional(),
    orderBy: Joi.string()
      .allow("")
      .valid("_id", "title", "createdAt")
      .trim()
      .optional(),
    direction: Joi.string()
      .valid(ORDER_BY_DIRECTIONS.ASC, ORDER_BY_DIRECTIONS.DESC)
      .optional(),
  }),
};

module.exports = carouselValidatorSchema;

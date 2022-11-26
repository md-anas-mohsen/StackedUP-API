const router = require("express").Router();
const carouselService = require("../services/carouselService");
const carouselValidatorSchema = require("../validators/carouselValidatorSchema");
const SchemaValidator = require("../middlewares/SchemaValidator");
const { isAuthenticatedUser } = require("../middlewares/auth");
const validator = new SchemaValidator();

router.get(
  "/",
  isAuthenticatedUser("admin"),
  validator.query(carouselValidatorSchema.carouselSlidesListingRequestModel),
  carouselService.getCarouselSlidesListing
);
router.get("/all-slides", carouselService.getAllCarouselSlides);

router.post(
  "/",
  isAuthenticatedUser("admin"),
  validator.body(carouselValidatorSchema.createCarouselSlideRequestModel),
  carouselService.createCarouselSlide
);

router.delete(
  "/:id",
  isAuthenticatedUser("admin"),
  carouselService.deleteCarouselSlide
);

module.exports = router;

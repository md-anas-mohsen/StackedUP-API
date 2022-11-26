const router = require("express").Router();
const productService = require("../services/productService");
const productValidatorSchema = require("../validators/productValidatorSchema");
const SchemaValidator = require("../middlewares/SchemaValidator");
const { isAuthenticatedUser } = require("../middlewares/auth");
const validator = new SchemaValidator();

router.post(
  "/",
  isAuthenticatedUser("admin"),
  validator.body(productValidatorSchema.createProductRequestModel),
  productService.createProduct
);
router.post(
  "/:id",
  isAuthenticatedUser(),
  validator.body(productValidatorSchema.createProductReviewRequestModel),
  productService.createProductReview
);
router.get(
  "/reviews",
  isAuthenticatedUser(),
  validator.query(productValidatorSchema.getProductReviewsRequestModel),
  productService.getProductReviews
);
router.delete(
  "/reviews",
  isAuthenticatedUser(),
  validator.query(productValidatorSchema.deleteProductReviewRequestModel),
  productService.deleteProductReview
);
router.get("/:id", productService.getSingleProduct);
router.put(
  "/:id",
  isAuthenticatedUser("admin"),
  validator.body(productValidatorSchema.updateProductRequestModel),
  productService.updateSingleProduct
);
router.delete(
  "/:id",
  isAuthenticatedUser("admin"),
  productService.deleteSingleProduct
);
router.get(
  "/",
  isAuthenticatedUser("admin"),
  validator.body(productValidatorSchema.productListingRequestModel),
  productService.getAllProducts
);

module.exports = router;

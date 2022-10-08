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

module.exports = router;

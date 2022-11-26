const router = require("express").Router();
const categoryService = require("../services/categoryService");
const categoryValidatorSchema = require("../validators/categoryValidatorSchema");
const SchemaValidator = require("../middlewares/SchemaValidator");
const { isAuthenticatedUser } = require("../middlewares/auth");
const validator = new SchemaValidator();

router.get(
  "/",
  validator.query(categoryValidatorSchema.categoryListingRequestModel),
  categoryService.getCategoryListing
);

router.get("/all-categories", categoryService.getAllCategories);

router.get(
  "/:id",
  isAuthenticatedUser("admin"),
  categoryService.getSingleCategory
);

router.post(
  "/",
  isAuthenticatedUser("admin"),
  validator.body(categoryValidatorSchema.createCategoryRequestModel),
  categoryService.createCategory
);

router.put(
  "/:id",
  isAuthenticatedUser("admin"),
  validator.body(categoryValidatorSchema.updateCategoryRequestModel),
  categoryService.updateCategory
);

router.delete(
  "/:id",
  isAuthenticatedUser("admin"),
  categoryService.deleteCategory
);

module.exports = router;

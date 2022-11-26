const Product = require("../models/product");
const MESSAGES = require("../constants/messages");
const { applyPagination } = require("../utils/generalHelpers");

const productService = {
  getAllProducts: async (req, res, next) => {
    const { keyword } = req.query;
    const products = await applyPagination(
      Product.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Product.searchQuery(keyword).count();

    return res.status(200).json({
      success: true,
      count,
      products,
    });
  },
  createProduct: async (req, res, next) => {
    const { name, price, description, images, categories, stock } = req.body;
    try {
      const product = await Product.create({
        name,
        price,
        description,
        images,
        categories,
        stock,
        user: req.user._id,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.PRODUCT_CREATION_FAILURE,
      });
    }

    return res.status(200).json({
      success: true,
      message: MESSAGES.PRODUCT_CREATION_SUCCESS,
    });
  },
  getSingleProduct: async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      return res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  },
  updateSingleProduct: async (req, res, next) => {
    const { id } = req.params;
    const { name, price, description, images, categories, stock } = req.body;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      console.log("here");
      product.name = name;
      product.price = price;
      product.description = description;
      if (images) {
        product.images = images;
        //TO DO: FILE UPLOAD DELETE OLD IMAGES
      }
      product.categories = categories;
      product.stock = stock;
      await product.save();
      return res.status(200).json({
        success: true,
        message: MESSAGES.PRODUCT_UPDATION_SUCCESS,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.SERVER_ERROR,
      });
    }
  },
  deleteSingleProduct: async (req, res, next) => {
    const { id } = req.params;
    try {
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: MESSAGES.PRODUCT_NOT_FOUND,
        });
      }
      await product.delete();
      return res.status(200).json({
        success: true,
        message: MESSAGES.PRODUCT_DELETION_SUCCESS,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: MESSAGES.PRODUCT_DELETION_FAILURE,
      });
    }
  },
  createProductReview: async (req, res) => {
    const { rating, comment } = req.body;
    const review = {
      user: req.user.id,
      comment,
      rating,
    };

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((review) => {
        if (review.user.toString() === req.user.id.toString()) {
          review.comment = comment;
          review.rating = rating;
        }
      });
    } else {
      product.reviews.push(review);
    }

    await Product.findByIdAndUpdate(req.params.id, {
      reviews: product.reviews,
    });

    res.status(200).json({
      success: true,
      message: "Review posted",
    });
  },
  getProductReviews: async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    res.status(200).json({
      success: true,
      reviews: product.reviews,
    });
  },
  deleteProductReview: async (req, res) => {
    const product = await Product.findById(req.query.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: MESSAGES.PRODUCT_NOT_FOUND,
      });
    }

    let reviewToDelete = product.reviews.filter(
      (review) => review._id.toString() === req.query.reviewId.toString()
    );

    if (reviewToDelete.userId !== req.user._id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: "Cannot delete this review",
      });
    }

    let reviews = product.reviews.filter(
      (review) => review._id.toString() !== req.query.reviewId.toString()
    );

    await Product.findByIdAndUpdate(req.query.productId, {
      reviews,
    });

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  },
};

module.exports = productService;

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
};

module.exports = productService;

const { SERVER_ERROR } = require("../constants/messages");
const Category = require("../models/category");
const Product = require("../models/product");

const {
  applyPagination,
  capitalizeEachWord,
} = require("../utils/generalHelpers");

const categoryService = {
  createCategory: async (req, res) => {
    const { name: nameInput, discount } = req.body;

    const name = capitalizeEachWord(nameInput);

    const categoryExists = await Category.findOne({
      name: {
        $regex: new RegExp("^" + name + "$", "i"),
      },
    });

    if (!!categoryExists) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    try {
      const category = await Category.create({
        name,
        discount,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: SERVER_ERROR,
      });
    }

    return res.status(201).json({
      success: false,
      message: "Category created succesfully",
    });
  },
  updateCategory: async (req, res) => {
    const { id } = req.params;
    const { name: nameInput, discount } = req.body;

    const name = capitalizeEachWord(nameInput);

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await Category.findByIdAndUpdate(id, {
      name,
      discount,
    });

    return res.status(200).json({
      success: true,
      message: "Category updated",
    });
  },
  deleteCategory: async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const products = await Product.find({
      categories: id,
    });

    let promises = [];

    for (let i = 0; i < products.length; i++) {
      let product = products[i];
      let categories = product.categories.filter(
        (categoryId) => categoryId !== id
      );
      promises.push(
        Product.findByIdAndUpdate(product._id, {
          categories,
        })
      );
    }

    await Promise.all(promises);

    await category.delete();

    return {
      sucess: false,
      message: "Category deleted successfully",
    };
  },
  getSingleCategory: async (req, res) => {
    const { id } = req.params;

    try {
      const category = await Category.findById(id);

      if (!category) {
        res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      const products = await Product.find({
        categories: id,
      });

      return res.status(200).json({
        success: true,
        category,
        products,
      });
    } catch (err) {
      return res.status(500).json({
        success: true,
        message: "Category not found",
      });
    }
  },
  getCategoryListing: async (req, res) => {
    const { keyword } = req.query;

    const categories = await applyPagination(
      Category.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Category.searchQuery(keyword).count();

    return res.status(200).json({
      success: true,
      count,
      categories,
    });
  },
  getAllCategories: async (req, res) => {
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      categories,
    });
  },
};

module.exports = categoryService;

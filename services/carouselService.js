const { SERVER_ERROR } = require("../constants/messages");
const Carousel = require("../models/carousel");
const { applyPagination } = require("../utils/generalHelpers");
const cloudinary = require("cloudinary");

const carouselService = {
  getAllCarouselSlides: async (req, res) => {
    const slides = await Carousel.find();

    return res.status(200).json({
      success: true,
      slides,
    });
  },
  getCarouselSlidesListing: async (req, res) => {
    const { keyword } = req.query;
    const slides = await applyPagination(
      Carousel.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Carousel.searchQuery(keyword).count();

    return res.status(200).json({
      success: true,
      count,
      slides,
    });
  },
  createCarouselSlide: async (req, res) => {
    const { title, body, link } = req.body;

    let image = "";
    if (typeof req.body.image === "string") {
      image = req.body.image;
    }

    let imageLink = "";

    try {
      const result = await cloudinary.v2.uploader.upload(image, {
        folder: "carousel",
      });
      imageLink = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      req.body.image = imageLink;

      const carouselSlide = await Carousel.create(req.body);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: SERVER_ERROR,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Slide added successfully",
    });
  },
  deleteCarouselSlide: async (req, res) => {
    try {
      let carouselSlide = await Carousel.findById(req.params.id);
      if (!carouselSlide) {
        return next(new ErrorHandler("Carousel slide not found", 404));
      }

      const result = await cloudinary.v2.uploader.destroy(
        carouselSlide.image.public_id
      );

      await Carousel.findByIdAndDelete(req.params.id);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: SERVER_ERROR,
      });
    }

    res.status(200).json({
      success: true,
      message: "Featured slide deleted successfully",
    });
  },
};

module.exports = carouselService;

const mongoose = require("mongoose");

const carouselSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter carousel slide title"],
    trim: true,
    maxLength: [20, "title must be within the range = 20"],
  },
  body: {
    type: String,
    required: [true, "Please enter carousel slide body"],
    trim: true,
    maxLength: [100, "body must be within the range = 100"],
  },
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  link: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

carouselSchema.pre("count", function () {
  this.where({ deletedAt: null });
});

carouselSchema.pre("find", function () {
  this.where({ deletedAt: null });
});

carouselSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});

carouselSchema.methods.delete = async function () {
  if (!this.deletedAt) {
    this.deletedAt = Date.now();
    await this.save();
  }
};

carouselSchema.statics.searchQuery = function (keyword, queryParams) {
  const stringSearchFields = ["title"];
  const alphaNumericSearchFields = ["_id"];

  let query = {};
  if (keyword) {
    query = {
      $or: [
        ...stringSearchFields.map((field) => ({
          [field]: {
            $regex: keyword,
            $options: "i",
          },
        })),
        ...alphaNumericSearchFields.map((field) => ({
          $where: `/.*${keyword}.*/.test(this.${field})`,
        })),
      ],
    };
  }

  return this.find(query);
};

module.exports = mongoose.model("Carousel", carouselSchema);

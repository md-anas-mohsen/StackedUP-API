const mongoose = require("mongoose");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");

const carouselSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter carousel slide title"],
    trim: true,
    maxLength: [20, "title must be within the range = 20"],
  },
  description: {
    type: String,
    required: [true, "Please enter carousel slide description"],
    trim: true,
    maxLength: [100, "Description must be within the range = 100"],
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
  const stringSearchFields = ["title", "description"];
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

  let sortableFields = ["_id", "title", "createdAt"];

  let sortOrder = {};

  if (!!queryParams && !!queryParams.orderBy) {
    let orderBy = queryParams.orderBy;
    direction = queryParams.direction || ORDER_BY_DIRECTIONS.ASC;
    sortOrder =
      sortableFields.includes(orderBy) &&
      direction === ORDER_BY_DIRECTIONS.DESC &&
      orderBy
        ? { [orderBy]: "desc" }
        : sortableFields.includes(orderBy) &&
          direction === ORDER_BY_DIRECTIONS.ASC &&
          orderBy
        ? { [orderBy]: "asc" }
        : {};
  }

  return this.find(query).sort(sortOrder);
};

module.exports = mongoose.model("Carousel", carouselSchema);

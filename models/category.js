const mongoose = require("mongoose");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter category name"],
    trim: true,
    unique: false,
    maxLength: [50, "Product name must be within the range = 50"],
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

categorySchema.pre("count", function () {
  this.where({ deletedAt: null });
});

categorySchema.pre("find", function () {
  this.where({ deletedAt: null });
});

categorySchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});

categorySchema.methods.delete = async function () {
  if (!this.deletedAt) {
    this.deletedAt = Date.now();
    await this.save();
  }
};

categorySchema.statics.searchQuery = function (keyword, queryParams) {
  const stringSearchFields = ["name"];
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

  let sortableFields = ["createdAt"];

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

module.exports = mongoose.model("Category", categorySchema);

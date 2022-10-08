const mongoose = require("mongoose");
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [90, "Product name must be within the range = 90"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
    },
  ],
  categories: [
    {
      type: String,
    },
  ],
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
        required: true,
      },
      rating: {
        type: Number,
        required: true,
        min: [0, "Rating must be between 1 to 5"],
        max: [5, "Rating must be between 1 to 5"],
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
});
productSchema.pre("find", function () {
  this.where({ deletedAt: null });
});

productSchema.pre("findOne", function () {
  this.where({ deletedAt: null });
});

productSchema.pre("save", async function (next) {
  this.updatedAt = Date.now();
});

productSchema.methods.delete = async function () {
  if (!this.deletedAt) {
    this.deletedAt = Date.now();
    await this.save();
  }
};

module.exports = mongoose.model("Product", productSchema);

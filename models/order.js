const mongoose = require("mongoose");
const { ORDER_BY_DIRECTIONS } = require("../constants/common");
const { ORDER_STATUS } = require("../constants/orders");

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User",
  },
  orderItems: [
    {
      quantity: {
        type: Number,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
  paidAt: {
    type: Date,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: ORDER_STATUS.PROCESSING,
    enum: [
      ORDER_STATUS.PROCESSING,
      ORDER_STATUS.IN_TRANSIT,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
    ],
  },
  deliveredOn: {
    type: Date,
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

orderSchema.pre("count", function () {
  this.populate("user")
    .populate("orderItems.product")
    .where({ deletedAt: null });
});

orderSchema.pre("find", function () {
  this.populate("user")
    .populate("orderItems.product")
    .where({ deletedAt: null });
});

orderSchema.pre("findOne", function () {
  this.populate("user")
    .populate("orderItems.product")
    .where({ deletedAt: null });
});

orderSchema.methods.delete = async function () {
  if (!this.deletedAt) {
    this.deletedAt = Date.now();
    await this.save();
  }
};

orderSchema.statics.searchQuery = function (keyword, queryParams) {
  const stringSearchFields = ["orderStatus"];
  const alphaNumericSearchFields = ["_id"];

  let query = {};
  if (keyword) {
    query = {
      ...stringSearchFields.map((field) => ({
        [field]: {
          $regex: keyword,
          $options: "i",
        },
      })),
      $or: [
        ...alphaNumericSearchFields.map((field) => ({
          $where: `/.*${keyword}.*/.test(this.${field})`,
        })),
      ],
    };
  }

  if (!!queryParams && queryParams.userId) {
    query.user = queryParams.userId;
  }

  let sortableFields = ["totalPrice", "_id", "createdAt", "orderStatus"];

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

module.exports = mongoose.model("Order", orderSchema);

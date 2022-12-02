const {
  ORDER_CREATION_SUCCESS,
  SERVER_ERROR,
} = require("../constants/messages");
const { ORDER_STATUS } = require("../constants/orders");
const Order = require("../models/order");
const Product = require("../models/product");
const { applyPagination } = require("../utils/generalHelpers");

const updateStock = async (id, quantity) => {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
};

const orderService = {
  newOrder: async (req, res) => {
    const { orderItems, shippingInfo, paymentInfo } = req.body;

    for (let i = 0; i < orderItems.length; i++) {
      let item = orderItems[i];
      const productExists = await Product.findById(item.product);

      if (!productExists) {
        return res.status(404).json({
          success: false,
          message: "Invalid product ID specified, product not found",
        });
      }

      orderItems[i].price = productExists.price;
    }

    const shippingPrice = 10;
    const itemsPrice = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const taxPrice = 10;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    try {
      const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user.id,
      });

      res.status(200).json({
        success: true,
        order,
        message: ORDER_CREATION_SUCCESS,
      });
    } catch (err) {
      res.status(500).json({
        success: true,
        message: SERVER_ERROR,
      });
    }
  },
  getSingleOrder: async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    if (order.user._id != req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Insufficient Privilege to view resource",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  },
  updateOrder: async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order.orderStatus === ORDER_STATUS.DELIVERED) {
      return res.status(400).json({
        success: false,
        message: "Order has been already delivered",
      });
    }

    if (
      order.orderStatus === ORDER_STATUS.PROCESSING &&
      req.body.orderStatus !== ORDER_STATUS.IN_TRANSIT
    ) {
      return res.status(400).json({
        success: false,
        message: "Order needs to be dispatched",
      });
    }

    if (
      order.orderStatus === ORDER_STATUS.IN_TRANSIT &&
      req.body.orderStatus !== ORDER_STATUS.DELIVERED
    ) {
      return res.status(400).json({
        success: false,
        message: "Order is already in transit",
      });
    }

    order.orderStatus = req.body.orderStatus;
    if (order.orderStatus === ORDER_STATUS.IN_TRANSIT) {
      let promises = [];
      order.orderItems.forEach((item) => {
        promises.push(updateStock(item.product, item.quantity));
      });

      try {
        await Promise.all(promises);
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: SERVER_ERROR,
        });
      }
    }

    if (req.body.orderStatus === ORDER_STATUS.DELIVERED) {
      order.deliveredOn = Date.now();
    }
    await order.save();
    res.status(200).json({
      success: true,
    });
  },
  deleteOrder: async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No Order found with this ID",
      });
    }

    if (
      ![ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED].includes(
        order.orderStatus
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Only delivered or cancelled orders may be deleted",
      });
    }

    await order.delete();

    res.status(200).json({
      success: true,
    });
  },
  getOrderListing: async (req, res) => {
    const { keyword } = req.query;
    const orders = await applyPagination(
      Order.searchQuery(keyword, req.query),
      req.query
    );
    const count = await Order.searchQuery(keyword).count();
    let totalAmount = await Order.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          totalAmount: {
            $sum: { $cond: [{ $ne: ["$paidAt", null] }, "$totalPrice", 0] },
          },
        },
      },
    ]);

    totalAmount = totalAmount ? totalAmount[0]?.totalAmount : 0;

    return res.status(200).json({
      success: true,
      count,
      orders,
      totalAmount,
    });
  },
  myOrderListing: async (req, res) => {
    const { keyword, orderBy, direction } = req.query;
    const orders = await applyPagination(
      Order.searchQuery(keyword, { ...req.query, userId: req.user._id }),
      req.query
    );
    const count = await Order.searchQuery(keyword).count();

    return res.status(200).json({
      success: true,
      count,
      orders,
    });
  },
};

module.exports = orderService;

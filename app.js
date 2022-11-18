const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const users = require("./routes/user");
const products = require("./routes/product");
const orders = require("./routes/orders");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth API - Web dev fall 2022",
  });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

module.exports = app;

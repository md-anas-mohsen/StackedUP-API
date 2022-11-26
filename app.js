const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const users = require("./routes/user");
const products = require("./routes/product");
const orders = require("./routes/orders");
const categories = require("./routes/categories");
const carousel = require("./routes/carousel");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(fileUpload());

app.use("/api/users", users);
app.use("/api/products", products);
app.use("/api/orders", orders);
app.use("/api/categories", categories);
app.use("/api/carousel", carousel);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Stacked UP API - Web dev fall 2022",
  });
});

app.use((req, res, next) => {
  res.status(404).json({ success: false, message: "Not Found" });
});

module.exports = app;

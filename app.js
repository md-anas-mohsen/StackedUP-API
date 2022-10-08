const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

const users = require("./routes/user");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", users);

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

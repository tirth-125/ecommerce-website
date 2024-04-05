const express = require("express");
const app = express();
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cookieParser = require("cookie-parser");

const errorMiddleware = require("./middleware/error");

// json middleware
app.use(express.json());
app.use(cookieParser());
// User Route
app.use('/api/v1/user',userRoutes);
// Product Route
app.use('/api/v1/product',productRoutes);
// error middleware
app.use(errorMiddleware);

module.exports = app; 
require("dotenv").config();
//Import core packages
const express = require("express");
const cors = require("cors");
const cloudinary = require('cloudinary').v2;
const morgan = require("morgan");

//Import middle ware
const errorMiddleware = require("./middlewares/errorMiddleware");

//data base connection
const connection = require("./database");
connection();

// import routes
const { authRoutes } = require("./routes/auth");
const { userRouter } = require("./routes/userRoutes");
const { ordersRoutes } = require("./routes/ordersRoutes");

// import cloudinary routes
const { cloudinaryRoutes } = require("./routes/cloudinaryRoutes");

//Module impoer
const Product = require("./models/Product");

// Init Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Mount APi routes
app.use("/api", authRoutes);
app.use('/api/user', userRouter);
app.use('/api/orders', ordersRoutes);

//cloudinary routes
app.use('/api', cloudinaryRoutes);

//global errors middleware
app.use(errorMiddleware)

// Start server
app.listen(5000, () => {
    console.log("backend is running!");
});

require("dotenv").config();
//Import core packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");


const connection = require("./database");

// import routes
const { authRoutes } = require("./routes/auth");
const { userRouter } = require("./routes/userRoutes");


const Product = require("./models/Product");
connection();

// Init Express App
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

// Routes
app.get('/data', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});



// Mount APi routes
app.use("/api", authRoutes);
app.use('/api/user', userRouter);

// Start server
app.listen(5000, () => {
    console.log("backend is running!");
});
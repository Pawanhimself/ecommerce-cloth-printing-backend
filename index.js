require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connection = require("./database");
const { authRoutes } = require("./routes/auth");
const Product = require("./models/Product");
connection();

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get('/data', async (req, res) => {
    const products = await Product.find();
    res.send(products);
});

app.use(express.json());
app.use(cors());

app.use("/api", authRoutes);

app.listen(5000, () => {
    console.log("backend is running!");
});
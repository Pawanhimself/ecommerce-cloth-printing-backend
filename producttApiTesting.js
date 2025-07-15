const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product"); // Adjust path if needed

// Connect to MongoDB
mongoose.connect(process.env.DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

// Dummy product data
const sizes = ["S", "M", "L", "XL"];
const colors = ["Red", "Blue", "Green"];

const variants = [];

sizes.forEach(size => {
  colors.forEach(color => {
    variants.push({
      size,
      color,
      price: 499,
      inventory_quantity: 50
    });
  });
});

const dummyProduct = new Product({
  title: "Custom T-Shirt",
  description: "Premium quality cotton t-shirt with customizable print",
  price: 499,
  status: "active",
  variants
});

// Save to DB
dummyProduct.save()
  .then(() => {
    console.log("Dummy product saved successfully!");
    mongoose.connection.close();
  })
  .catch(err => {
    console.error("Error saving product:", err);
    mongoose.connection.close();
  });

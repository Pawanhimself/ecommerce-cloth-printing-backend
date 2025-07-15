const mongoose = require('mongoose');
const { generateUniqueId } = require('../helper/library');
const slugify = require("slugify");

const imageSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  position: Number,
  width: Number,
  height: Number,
  src: String,
  variant_ids: [Number]
});

const variantSchema = new mongoose.Schema({
  id: Number,
  product_id: Number,
  title: String,
  price: Number,
  position: Number,
  size: String,
  color: String,
  inventory_quantity: Number,
  image_id: Number
});

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  handle: { type: String, unique: true }, 
  status: { type: String, enum: ['active', 'draft', 'archived'], default: 'active' },
  tags: [String],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  images: [imageSchema],
  image: imageSchema,
  variants: [variantSchema]
});

productSchema.pre('save', async function (next) {
  if (!this.handle && this.title) {
    const base = slugify(this.title, { lower: true, strict: true }); // e.g. "Cutton T-shirt" → "cutton-t-shirt"
    let handle = base;
    let count = 1;

    while (await mongoose.models.Product.findOne({ handle })) {
      handle = `${base}-${count++}`;
    }

    this.handle = handle;
  }

  this.updated_at = new Date(); // auto-update timestamp
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
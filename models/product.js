const mongoose = require('mongoose');
const typeSchema = new mongoose.Schema({
  id: Number,
  variant: String,
  stock: String,
  mrp_price: String,
  cost_price: String,
  selling_price: String,
  gst_percent: String,
  gst_amount: String,
  profit: String,
  amt: String,
  net_cost: String,
  net_amt: String
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
    Category:String,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  productImg: { type: String, required: true },
  bannerImgs: [String],
  seo_title: String,
  seo_description: String,
  seo_keywords: String,
  type: [typeSchema], // Array of variants
  units_sold: { type: Number, default: 0 },      // <--- added here
  product_views: { type: Number, default: 0 },   // <--- added here
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

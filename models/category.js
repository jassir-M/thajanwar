const mongoose = require('mongoose');


const categorySchema = new mongoose.Schema({
 
  category_list: [
    {
      categories_name: {
        type: String,
        required: true
      },
       img: {
    type: String,
    required: true
  },
   description: {
        type: String,
        default: ''
      },
      product_count: {
        type: Number,
        default: 0
      },
      status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
      },
      total_revenue: {
        type: Number,
        default: 0
      },
      profit: {
        type: Number,
        default: 0
      },
      expenses: {
        type: Number,
        default: 0
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

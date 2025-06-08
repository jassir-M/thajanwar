const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  account_type: {
    type: String,
    enum: ['user', 'admin', 'manager'],
    required: true,
    default: 'user'
  },
  cartItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true, default: 1 }
    }
  ],
  amount_spend: { type: Number, default: 0 },
  last_order: { type: Date, default: null },
  redeems_points: { type: Number, default: 0 },
feedback: [
  {
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
],  address: [
    {
      street: String,
      city: String,
      state: String,
      zip: String,
      country: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

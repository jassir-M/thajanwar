const User = require('../models/user');
const Product = require('../models/product');

// @desc    Add item to cart
// @route   POST /cart
// @access  Private
const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    const user = await User.findById(userId);

    const existingItem = user.cart.find(item => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      user.cart.push({ product: productId, quantity });
    }

    await user.save();
    res.json({ message: 'Item added to cart', cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add to cart' });
  }
};

// @desc    Get user cart
// @route   GET /cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

module.exports = { addToCart, getCart };

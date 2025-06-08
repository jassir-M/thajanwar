const Order = require('../models/order');
const User = require('../models/user');

const createOrder = async (req, res) => {
    const { shippingAddress, paymentMethod, totalPrice } = req.body;
  
    try {
      const user = await User.findById(req.user._id).populate('cart.product');
  
      if (!user || user.cart.length === 0) {
        return res.status(400).json({ message: 'Cart is empty' });
      }
  
      const orderItems = user.cart.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));
  
      const order = new Order({
        user: req.user._id,
        orderItems,
        shippingAddress,
        paymentMethod,
        totalPrice
      });
  
      const createdOrder = await order.save();
  
      // Optional: Clear cart after order is placed
      user.cart = [];
      await user.save();
  
      res.status(201).json(createdOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to create order' });
    }
  };

  const getMyOrders = async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id }).populate('orderItems.product');
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch your orders' });
    }
  };
  const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find().populate('user', 'name email');
      res.json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to fetch all orders' });
    }
  };
  


  const markAsPaid = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        const updatedOrder = await order.save();
        res.json({ message: 'Order marked as paid', order: updatedOrder });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to update payment status' });
    }
  };
  
  // @desc    Mark order as delivered
  // @route   PUT /orders/:id/deliver
  // @access  Private/Admin
  const markAsDelivered = async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (order) {
        order.isDelivered = true;
        order.deliveredAt = new Date();
        const updatedOrder = await order.save();
        res.json({ message: 'Order marked as delivered', order: updatedOrder });
      } else {
        res.status(404).json({ message: 'Order not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Failed to update delivery status' });
    }
  };
  
  module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    markAsPaid,
    markAsDelivered
  };
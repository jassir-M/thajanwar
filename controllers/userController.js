const User = require('../models/user');

// Reconst User = require('../models/user');
const generateToken = require('../utils/generateToken');

// Register without password
const registerUser = async (req, res) => {
  const { name, email, phone } = req.body;

  // Simple validation for email and phone
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (!phone || !/^\d{10}$/.test(phone)) {
    return res.status(400).json({ error: 'Phone number must be exactly 10 digits' });
  }

  try {
    const userExists = await User.findOne({
      $or: [{ email }, { phone }]
    });
    if (userExists) return res.status(400).json({ error: 'User already exists' });

    const user = await User.create({
      name,
      email,
      phone,
      address: [],
      cartItems: [],
      ordersList: [],
      amount_spend: 0,
      last_order: null,
      redeems_points: 0,
      feedback: [],
      account_type: "user"
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login


const loginUser = async (req, res) => {
  const { email, phone } = req.body;

  try {
    let user;

    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    } else {
      return res.status(400).json({ error: 'Please provide email or phone to login' });
    }

    if (user) {
      // Since you removed password, consider your auth approach here
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};


module.exports = { registerUser, loginUser };

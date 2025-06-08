const Product = require('../models/product');

// GET all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// POST create new product
const createProduct = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// PUT /products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id)

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
// DELETE /api/products/:id
 const deleasync =async(req, res) => {
  try {
    const productId = req.params.id;
    await Product.findByIdAndDelete(productId); // mongoose
    res.status(200).json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};



const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
  
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ message: 'Product not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching product' });
    }
  };


  
  module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct
  };
  

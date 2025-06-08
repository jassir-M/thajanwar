const express = require('express');
const router = express.Router();
const { getProducts, createProduct,getProductById ,updateProduct} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');




router.get('/',getProducts);
router.post('/createproduct', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);

module.exports = router;
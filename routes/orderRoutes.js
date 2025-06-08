const express = require('express');
const router = express.Router();
const { createOrder,getMyOrders ,getAllOrders,markAsPaid,markAsDelivered} = require('../controllers/orderController');
const { protect ,admin} = require('../middleware/authMiddleware');

router.post('/', protect, createOrder);
router.get('/myorders', protect, getMyOrders); 
router.get('/', protect, admin, getAllOrders); // ✅ admin-only route
router.put('/:id/pay', protect, admin, markAsPaid);       // ✅ mark as paid
router.put('/:id/deliver', protect, admin, markAsDelivered); // ✅ mark as delivered


module.exports = router;

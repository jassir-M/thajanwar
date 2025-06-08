
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // using memory buffer
const { getCategoryList ,UpdateCategoryList, uploadImage} = require('../controllers/categoryController');

router.get('/categories', getCategoryList);
router.post('/upload',upload.single("img"),uploadImage)
router.post('/add_category',UpdateCategoryList)
module.exports = router;
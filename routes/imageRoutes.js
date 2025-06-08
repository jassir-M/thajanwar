
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // using memory buffer
const { uploadProductImage,uploadBannerImage} = require('../controllers/imageControllers');

router.post('/upload',upload.single("img"),uploadProductImage)


module.exports = router;

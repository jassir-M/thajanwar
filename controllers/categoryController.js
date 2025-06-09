// controllers/categoryController.js
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // ✅ Added sharp
const streamifier = require('streamifier');


dotenv.config();

cloudinary.config({
  cloud_name: 'dbpybqs9r',
  secure: true,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});



const Category = require('../models/category'); // Adjust path if needed

const getCategoryList = async (req, res) => {
  try {
    const categories = await Category.find();

    if (!categories || categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    res.status(200).json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch category list' });
  }
};


const uploadImage = async (req, res) => {
  console.log('hi')
  if (!req.file) {
    return res.status(400).json({ error: "No file provided" });
  }

  try {


     const compressedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1000 }) // or change as needed
      .jpeg({ quality: 70 })   // reduce quality to reduce size
      .toBuffer();

    const streamUpload = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            transformation: [
              { width: 500, height: 500, crop: "fill" },
               { radius: "max" },  
              { quality: "auto" },
              { fetch_format: "auto" },
            ],
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });

    const result = await streamUpload(compressedBuffer);
    console.log("✅ Image uploaded:", result.secure_url);

    // You can now use result.secure_url in MongoDB save logic or return it
    res.status(200).json({ imageUrl: result.secure_url });

  } catch (err) {
    console.error("❌ Upload failed:", err);
    res.status(500).json({ error: "Cloudinary upload failed" });
  }
};



const UpdateCategoryList = async (req, res) => {
  const { categoryId,categories_name, img, description ,status} = req.body;
  console.log(req.body)
  console.log(img)
 
if (!categoryId=='') {
  await Category.updateOne(
    { "category_list._id": categoryId },
    {
      $set: {
        "category_list.$.img": img,
        "category_list.$.description": description,
        "category_list.$.status": 'active'
      }
    }
  );
        res.status(200).json({ message: 'Category updated successfully' });

}else {
      // Add new category to the list
      await Category.updateOne({}, {
        $push: {
          category_list: {
            categories_name,
            img,
            description,
            product_count: 0,
            status,
            total_revenue: 0,
            profit: 0,
            expenses: 0
          }
        }
      });
      res.status(200).json({ message: 'Category added successfully' });
    }
   

    // Check if category already exists
 

  
};


  




module.exports = { getCategoryList , UpdateCategoryList , uploadImage};

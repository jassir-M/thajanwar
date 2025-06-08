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



  
  const uploadProductImage = async (req, res) => {
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
  
  
  
   const uploadBannerImage = async (req, res) => {
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


module.exports = { uploadBannerImage , uploadProductImage};
  
  
  
  
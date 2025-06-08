const cloudinary = require('cloudinary').v2
const dotenv = require('dotenv');

dotenv.config()

cloudinary.config({
    cloud_name:'dbpybqs9r',
    secure:true,
    api_key:process.env.CLOUDINARY_API,
    api_secret:process.env.CLOUDINARY_SECRET
});

const upload =async(url)=>{
  try {
    const result = await cloudinary.uploader.upload('./product.png',{
      transformation: [
        { width: 500, height: 500, crop: 'fill' },  // Resize and crop
        { quality: 'auto' },                        // Optimize quality
        { fetch_format: 'auto' }                    // Auto format (e.g., WebP)
      ]});
    console.log('Image uploaded:', result.secure_url);
  } catch (err) {
    console.error('Upload failed:', err);
  }
};


const url = cloudinary.url('samples/dessert-on-a-plate',{
  transformation: [
    { width: 300, height: 300, crop: 'thumb', gravity: 'face' },
    { radius: 'max' } // Fully rounded (circle)
  ]
})
console.log(url)







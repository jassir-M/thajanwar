const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp'); // ✅ Added sharp

dotenv.config();

cloudinary.config({
  cloud_name: 'dbpybqs9r',
  secure: true,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Mongoose schema
const productSchema = new mongoose.Schema({
  img: { type: String, required: true },
  banner_img: [{ type: String }],
  product_name: { type: String, required: true },
  description: { type: String },
  category: { type: String, required: true },
  mrp_price: { type: Number, required: true },
  weight: [{ type: Number }],
  purchase_price: { type: Number, required: true },
  selling_price: { type: Number, required: true },
  available_stock: { type: Number, default: 0 },
  minimum_stock_alert: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  units_sold: { type: Number, default: 0 },
  product_views: { type: Number, default: 0 },
  seo_title: { type: String, default: '' },
  seo_description: { type: String, default: '' },
  product_details: {
    brand: { type: String, default: '' },
    variety: { type: String, default: '' },
    item_form: { type: String, default: '' },
    description: [{ type: String }]
  }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// ✅ Image compression helper
async function compressImage(inputPath, outputPath, width = 800, quality = 70) {
  await sharp(inputPath)
    .resize({ width, fit: 'inside' })
    .jpeg({ quality })
    .toFile(outputPath);
}

// ✅ Upload product
async function addProduct(productData, imagePath, bannerPaths = []) {
  try {
    const compressedMainImagePath = path.join(__dirname, 'uploads', 'compressed_main.jpg');
    await compressImage(imagePath, compressedMainImagePath);

    const imgUpload = await cloudinary.uploader.upload(compressedMainImagePath, {
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    fs.unlinkSync(compressedMainImagePath); // Clean up

    const bannerUrls = [];
    for (let i = 0; i < bannerPaths.length; i++) {
      const originalBanner = bannerPaths[i];
      const compressedBanner = path.join(__dirname, 'uploads', `compressed_banner_${i}.jpg`);
      await compressImage(originalBanner, compressedBanner, 500);

      const bannerUpload = await cloudinary.uploader.upload(compressedBanner, {
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      });
      bannerUrls.push(bannerUpload.secure_url);
      fs.unlinkSync(compressedBanner); // Clean up
    }

    const newProduct = new Product({
      ...productData,
      img: imgUpload.secure_url,
      banner_img: bannerUrls
    });

    await newProduct.save();
    console.log('✅ Product saved:', newProduct.product_name);
    return newProduct;

  } catch (err) {
    console.error('❌ Failed to add product:', err.message);
    throw err;
  }
}


// Millets
addProduct({
  product_name: '24 Mantra Organic Foxtail Millet',
  description: 'Gluten-free, organic foxtail millet for healthy meals. 500g pack.',
  category: 'millets',
  mrp_price: 120,
  weight: [500],
  purchase_price: 90,
  selling_price: 110,
  available_stock: 100,
  gst: 5,
  seo_title: 'Foxtail Millet (Organic) - 500g | 24 Mantra',
  seo_description: 'Shop 100% organic foxtail millet online. High in fiber, low glycemic index.',
  product_details: {
    brand: '24 Mantra',
    variety: 'Foxtail',
    item_form: 'Grain',
    description: ['Organic Certified', 'Gluten-Free', 'High Fiber']
  }}, path.join(__dirname, 'uploads', 'thumb.png'), [path.join(__dirname, 'uploads', 'img1.png'), path.join(__dirname, 'uploads', 'img2.png')

  ,path.join(__dirname, 'uploads', 'img3.png')
]
);


// Pickles & Paste
addProduct({
  product_name: 'Priya Mango Pickle',
  description: 'Spicy mango pickle made with traditional Andhra recipe. 300g jar.',
  category: 'pickles_and_paste',
  mrp_price: 90,
  weight: [{weight_unit:'30 g',

  },{weight_unit:'300g'}],
  purchase_price: 65,
  selling_price: 80,
  available_stock: 120,
  gst: 12,
  seo_title: 'Priya Mango Pickle - Authentic Andhra Style - 300g',
  seo_description: 'Buy Priya Mango Pickle online. Spicy, tangy, and full of flavor.',
  product_details: {
    brand: 'Priya',
    variety: 'Mango',
    item_form: 'Paste',
    description: [{text:'Andhra Style'}, {text:'Tangy & Spicy'}, {text:'No Preservatives'}]
  }
}, path.join(__dirname, 'uploads', 'pickle.png'), [path.join(__dirname, 'uploads', 'carousel1.png'), path.join(__dirname, 'uploads', 'carousel2.png')]
);

// Cooking Oils
addProduct({
  product_name: 'Fortune Sunflower Oil',
  description: 'Refined sunflower oil, light and healthy, 1L pouch',
  category: 'cooking_oils',
  mrp_price: 170,
  weight: [1000],
  purchase_price: 135,
  selling_price: 160,
  available_stock: 180,
  gst: 5,
  seo_title: 'Fortune Sunflower Oil - Light & Healthy - 1L',
  seo_description: 'Buy Fortune Sunflower Oil online. Heart-friendly refined oil for cooking.',
  product_details: {
    brand: 'Fortune',
    variety: 'Sunflower',
    item_form: 'Liquid',
    description: ['Light on Stomach', 'Healthy Fats', 'Cholesterol Free']
  }
}, path.join(__dirname, 'uploads', 'oil.png'), [path.join(__dirname, 'uploads', 'carousel1.png'), path.join(__dirname, 'uploads', 'carousel2.png')]
);

// Millets
addProduct({
  product_name: '24 Mantra Organic Foxtail Millet',
  description: 'Gluten-free, organic foxtail millet for healthy meals. 500g pack.',
  category: 'millets',
  mrp_price: 120,
  weight: [500],
  purchase_price: 90,
  selling_price: 110,
  available_stock: 100,
  gst: 5,
  seo_title: 'Foxtail Millet (Organic) - 500g | 24 Mantra',
  seo_description: 'Shop 100% organic foxtail millet online. High in fiber, low glycemic index.',
  product_details: {
    brand: '24 Mantra',
    variety: 'Foxtail',
    item_form: 'Grain',
    description: ['Organic Certified', 'Gluten-Free', 'High Fiber']
  }
}, path.join(__dirname, 'uploads', 'millet.png'), 
[path.join(__dirname, 'uploads', 'carousel1.png'), path.join(__dirname, 'uploads', 'carousel2.png')]
);

// Rice & Grains
addProduct({
  product_name: 'India Gate Basmati Rice Classic',
  description: 'Premium basmati rice for biryani, 1kg pack.',
  category: 'rice_and_grains',
  mrp_price: 200,
  weight: [1000],
  purchase_price: 160,
  selling_price: 190,
  available_stock: 90,
  gst: 5,
  seo_title: 'India Gate Basmati Rice Classic - Long Grain - 1kg',
  seo_description: 'Premium basmati rice with aroma & length. Perfect for biryani & pulao.',
  product_details: {
    brand: 'India Gate',
    variety: 'Basmati',
    item_form: 'Grain',
    description: ['Extra Long Grain', 'Aromatic', 'Perfect for Biryani']
  }
}, path.join(__dirname, 'uploads', 'rice.png'), [path.join(__dirname, 'uploads', 'carousel1.png'), path.join(__dirname, 'uploads', 'carousel2.png')]
);

// Snacks & Health Mixes
addProduct({
  product_name: 'Manna Health Mix Powder',
  description: 'Multi-grain health mix with 14 natural ingredients. 500g pack.',
  category: 'snacks_and_health_mixes',
  mrp_price: 180,
  weight: [500],
  purchase_price: 140,
  selling_price: 160,
  available_stock: 130,
  gst: 5,
  seo_title: 'Manna Health Mix Powder - Multigrain - 500g',
  seo_description: 'Buy Manna Health Mix online. Nutritious blend of grains & pulses for all ages.',
  product_details: {
    brand: 'Manna',
    variety: 'Health Mix',
    item_form: 'Powder',
    description: ['14 Ingredients', 'No Sugar Added', 'Ideal for Children & Adults']
  }
}, path.join(__dirname, 'uploads', 'healthmix.png'), 

[path.join(__dirname, 'uploads', 'carousel1.png'), path.join(__dirname, 'uploads', 'carousel2.png')]
);

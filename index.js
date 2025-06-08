const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const imageRoutes = require('./routes/imageRoutes');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: '10mb' })); // Increase as needed
// routes
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/cart', cartRoutes);
// ... other setup above
app.use('/products', productRoutes);

app.use('/users', userRoutes);

app.use('/orders', orderRoutes);// config


app.use('/api', categoryRoutes);


app.use('/new', imageRoutes);












// database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

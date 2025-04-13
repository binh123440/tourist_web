const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const integratedTourRoutes = require('./routes/admin/integratedTourRoutes');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes cho người dùng
app.use('/api/tours', require('./routes/tourRoutes'));
app.use('/api/tourDetails', require('./routes/tourDetailRoutes'));
app.use('/api/destinations', require('./routes/destinationRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));

// Routes cho admin
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin/tours', require('./routes/admin/tourRoutes'));
app.use('/api/admin/tour-details', require('./routes/admin/tourDetailRoutes'));
app.use('/api/admin/gallery', require('./routes/admin/galleryRoutes'));
app.use('/api/admin/integrated-tours', integratedTourRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
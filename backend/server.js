// Import required modules
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config(); // Load environment variables

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporarily store uploads

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Enable CORS to allow frontend requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Route for file uploads
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const filePath = req.file.path;

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'uploads',
      transformation: [{ width: 500, height: 500, crop: 'limit' }],
    });

    // Remove local file after uploading to Cloudinary
    fs.unlinkSync(filePath);

    // Send Cloudinary URL as response
    res.status(200).json({
      message: 'File uploaded successfully!',
      url: result.secure_url,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).send('Error uploading file.');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

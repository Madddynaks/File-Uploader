const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Upload file and manipulate it using Cloudinary
const uploadFile = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'uploads',
      transformation: [
        { width: 500, height: 500, crop: "limit" } // Example transformation
      ]
    });

    // Remove the local file after upload
    fs.unlinkSync(filePath);

    res.status(200).json({
      message: 'File uploaded successfully!',
      url: result.secure_url,  // Cloudinary URL of the uploaded file
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ error: 'Failed to upload file.' });
  }
};

module.exports = { uploadFile };

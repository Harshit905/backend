const express = require('express');
const multer = require('multer');
const gfs = require('./file-handling/gridfs-setup');// Import your GridFS setup
const Blog = require('../models/Blog'); // Import your Blog model
const Image = require('../models/Image');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const imageUploadRouter = express.Router();

imageUploadRouter.post('/upload', upload.single('image'), (req, res) => {
  const { originalname, buffer } = req.file;

  // Create a write stream to store the image in GridFS
  const writeStream = gfs.createWriteStream({
    filename: originalname,
  });

  writeStream.on('close', (file) => {

    // You can save the image details in your database here if needed
    // For example, if you have an Image model
    const image = new Image({
      filename: file.filename,
      fileId: file._id,
    });
    image.save();

    res.json({ message: 'Image uploaded successfully', fileId: file._id });
  });

  writeStream.write(buffer);
  writeStream.end();
});

module.exports = imageUploadRouter;

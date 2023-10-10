const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  fileId: String,
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadedAt: { type: Date, default: Date.now },
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;

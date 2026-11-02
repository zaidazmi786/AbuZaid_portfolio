const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, default: '', trim: true },
    date: { type: String, default: '', trim: true }, // e.g. "18 Nov 2025"
    image: { type: String, default: '' },
    imagePublicId: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);

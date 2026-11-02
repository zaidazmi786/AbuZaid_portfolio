const express = require('express');
const Certificate = require('../models/Certificate');
const adminOnly = require('../middleware/auth');
const { upload, removeFile } = require('../middleware/upload');

const router = express.Router();

// multer errors (size / type) ko clean JSON me bhejo
const handleUpload = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (!err) return next();
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image 5MB se choti honi chahiye' : err.message;
    res.status(400).json({ message });
  });
};

// PUBLIC: sab certificates dekh sakte hain
router.get('/', async (req, res) => {
  try {
    const items = await Certificate.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: add (multipart/form-data, field name: image)
router.post('/', adminOnly, handleUpload, async (req, res) => {
  try {
    if (!req.body.title) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ message: 'Title required' });
    }
    const item = await Certificate.create({
      title: req.body.title,
      issuer: req.body.issuer || '',
      date: req.body.date || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(item);
  } catch (err) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: edit
router.put('/:id', adminOnly, handleUpload, async (req, res) => {
  try {
    const item = await Certificate.findById(req.params.id);
    if (!item) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: 'Certificate not found' });
    }

    if (req.body.title) item.title = req.body.title;
    if (req.body.issuer !== undefined) item.issuer = req.body.issuer;
    if (req.body.date !== undefined) item.date = req.body.date;

    if (req.file) {
      removeFile(item.image);
      item.image = `/uploads/${req.file.filename}`;
    } else if (req.body.removeImage === 'true') {
      removeFile(item.image);
      item.image = '';
    }

    await item.save();
    res.json(item);
  } catch (err) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: delete (image file bhi hat jati hai)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const item = await Certificate.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Certificate not found' });
    removeFile(item.image);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

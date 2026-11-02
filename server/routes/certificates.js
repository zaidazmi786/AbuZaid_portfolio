const express = require('express');
const Certificate = require('../models/Certificate');
const adminOnly = require('../middleware/auth');
const { upload, saveImage, deleteImage } = require('../middleware/upload');

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

const UPLOAD_FAILED = 'Image upload fail hui. Cloudinary settings check karo.';

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
  if (!req.body.title) {
    return res.status(400).json({ message: 'Title required' });
  }

  let img = { image: '', imagePublicId: '' };
  if (req.file) {
    try {
      img = await saveImage(req.file, 'portfolio/certificates');
    } catch (err) {
      return res.status(502).json({ message: UPLOAD_FAILED });
    }
  }

  try {
    const item = await Certificate.create({
      title: req.body.title,
      issuer: req.body.issuer || '',
      date: req.body.date || '',
      ...img,
    });
    res.status(201).json(item);
  } catch (err) {
    await deleteImage(img);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: edit
router.put('/:id', adminOnly, handleUpload, async (req, res) => {
  try {
    const item = await Certificate.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Certificate not found' });

    const old = { image: item.image, imagePublicId: item.imagePublicId };

    if (req.body.title) item.title = req.body.title;
    if (req.body.issuer !== undefined) item.issuer = req.body.issuer;
    if (req.body.date !== undefined) item.date = req.body.date;

    let replaced = false;
    let uploaded = null;
    if (req.file) {
      try {
        uploaded = await saveImage(req.file, 'portfolio/certificates');
      } catch (err) {
        return res.status(502).json({ message: UPLOAD_FAILED });
      }
      item.image = uploaded.image;
      item.imagePublicId = uploaded.imagePublicId;
      replaced = true;
    } else if (req.body.removeImage === 'true') {
      item.image = '';
      item.imagePublicId = '';
      replaced = true;
    }

    try {
      await item.save();
    } catch (err) {
      await deleteImage(uploaded);
      throw err;
    }
    if (replaced) await deleteImage(old);
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: delete (image bhi hat jati hai)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const item = await Certificate.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Certificate not found' });
    await deleteImage(item);
    res.json({ message: 'Certificate deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

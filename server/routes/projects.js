const express = require('express');
const Project = require('../models/Project');
const adminOnly = require('../middleware/auth');
const { upload, saveImage, deleteImage } = require('../middleware/upload');

const router = express.Router();

const parseTech = (tech) =>
  Array.isArray(tech)
    ? tech
    : String(tech || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

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

// PUBLIC: sab projects dekh sakte hain
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: add (multipart/form-data, field name: image)
router.post('/', adminOnly, handleUpload, async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description required' });
  }

  let img = { image: '', imagePublicId: '' };
  if (req.file) {
    try {
      img = await saveImage(req.file, 'portfolio/projects');
    } catch (err) {
      return res.status(502).json({ message: UPLOAD_FAILED });
    }
  }

  try {
    const project = await Project.create({
      title,
      description,
      tech: parseTech(req.body.tech),
      liveUrl: req.body.liveUrl || '',
      githubUrl: req.body.githubUrl || '',
      ...img,
    });
    res.status(201).json(project);
  } catch (err) {
    await deleteImage(img);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: edit (nayi image bheji to purani delete ho jati hai)
router.put('/:id', adminOnly, handleUpload, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const old = { image: project.image, imagePublicId: project.imagePublicId };

    if (req.body.title) project.title = req.body.title;
    if (req.body.description) project.description = req.body.description;
    if (req.body.tech !== undefined) project.tech = parseTech(req.body.tech);
    if (req.body.liveUrl !== undefined) project.liveUrl = req.body.liveUrl;
    if (req.body.githubUrl !== undefined) project.githubUrl = req.body.githubUrl;

    let replaced = false;
    let uploaded = null;
    if (req.file) {
      try {
        uploaded = await saveImage(req.file, 'portfolio/projects');
      } catch (err) {
        return res.status(502).json({ message: UPLOAD_FAILED });
      }
      project.image = uploaded.image;
      project.imagePublicId = uploaded.imagePublicId;
      replaced = true;
    } else if (req.body.removeImage === 'true') {
      project.image = '';
      project.imagePublicId = '';
      replaced = true;
    }

    try {
      await project.save();
    } catch (err) {
      await deleteImage(uploaded);
      throw err;
    }
    if (replaced) await deleteImage(old);
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: delete (image bhi hat jati hai)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await deleteImage(project);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const Project = require('../models/Project');
const adminOnly = require('../middleware/auth');
const { upload, removeFile } = require('../middleware/upload');

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
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`);
      return res.status(400).json({ message: 'Title and description required' });
    }
    const project = await Project.create({
      title,
      description,
      tech: parseTech(req.body.tech),
      liveUrl: req.body.liveUrl || '',
      githubUrl: req.body.githubUrl || '',
      image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    res.status(201).json(project);
  } catch (err) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: edit (nayi image bheji to purani delete ho jati hai)
router.put('/:id', adminOnly, handleUpload, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      if (req.file) removeFile(`/uploads/${req.file.filename}`);
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.body.title) project.title = req.body.title;
    if (req.body.description) project.description = req.body.description;
    if (req.body.tech !== undefined) project.tech = parseTech(req.body.tech);
    if (req.body.liveUrl !== undefined) project.liveUrl = req.body.liveUrl;
    if (req.body.githubUrl !== undefined) project.githubUrl = req.body.githubUrl;

    if (req.file) {
      removeFile(project.image);
      project.image = `/uploads/${req.file.filename}`;
    } else if (req.body.removeImage === 'true') {
      removeFile(project.image);
      project.image = '';
    }

    await project.save();
    res.json(project);
  } catch (err) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: delete (image file bhi hat jati hai)
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    removeFile(project.image);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

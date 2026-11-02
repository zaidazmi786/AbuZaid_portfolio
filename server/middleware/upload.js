const path = require('path');
const fs = require('fs');
const multer = require('multer');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `project-${unique}${ext}`);
  },
});

const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype.startsWith('image/') && allowed.includes(ext)) return cb(null, true);
  cb(new Error('Sirf image allowed hai (jpg, png, webp, gif)'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

// Purani image file disk se hatane ke liye
function removeFile(imagePath) {
  if (!imagePath || !imagePath.startsWith('/uploads/')) return;
  const full = path.join(uploadDir, path.basename(imagePath));
  fs.unlink(full, () => {});
}

module.exports = { upload, removeFile, uploadDir };

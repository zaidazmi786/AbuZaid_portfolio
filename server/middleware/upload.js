const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');

// Local fallback folder (jab Cloudinary keys set nahi hoti)
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// File pehle memory me aati hai, phir Cloudinary (ya local disk) par save hoti hai
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (file.mimetype.startsWith('image/') && allowed.includes(ext)) return cb(null, true);
    cb(new Error('Sirf image allowed hai (jpg, png, webp, gif)'));
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const cloudEnabled = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

const configureCloud = () =>
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

/**
 * Multer ki file save karo. Returns { image, imagePublicId }.
 * Cloudinary on ho to wahan, warna server/uploads me.
 */
async function saveImage(file, folder = 'portfolio') {
  if (cloudEnabled()) {
    configureCloud();
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (err, res) => (err ? reject(err) : resolve(res))
      );
      stream.end(file.buffer);
    });
    return { image: result.secure_url, imagePublicId: result.public_id };
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const name = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  await fs.promises.writeFile(path.join(uploadDir, name), file.buffer);
  return { image: `/uploads/${name}`, imagePublicId: '' };
}

/** Document ({ image, imagePublicId }) ki purani image hatao. Fail ho to ignore. */
async function deleteImage(doc) {
  if (!doc || !doc.image) return;
  try {
    if (doc.imagePublicId) {
      configureCloud();
      await cloudinary.uploader.destroy(doc.imagePublicId);
    } else if (doc.image.startsWith('/uploads/')) {
      await fs.promises.unlink(path.join(uploadDir, path.basename(doc.image)));
    }
  } catch (err) {
    /* image pehle hi hat chuki ho sakti hai */
  }
}

module.exports = { upload, saveImage, deleteImage, uploadDir };

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Uploaded project images publicly serve hongi
const { uploadDir } = require('./middleware/upload');
app.use('/uploads', express.static(uploadDir));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
   
   app.use('/api/certificates', require('./routes/certificates'));
app.get('/api/health', (req, res) => res.json({ ok: true }));

// Pehli baar chalne par .env wale credentials se admin bana do
async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('ADMIN_EMAIL / ADMIN_PASSWORD not set, admin seed skipped');
    return;
  }
  const exists = await User.findOne({ email });
  if (!exists) {
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash, role: 'admin' });
    console.log('Admin user created:', email);
  }
}

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    await seedAdmin();
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

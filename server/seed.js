// Resume wale projects ek baar database me daalne ke liye: npm run seed
// Sirf tab chalta hai jab database me koi project na ho. Images admin panel se baad me upload karo.
require('dotenv').config();
const mongoose = require('mongoose');
const Project = require('./models/Project');

const projects = [
  {
    title: 'Real-Time Video Conferencing Platform',
    description:
      'Zoom/Google Meet-style platform with real-time multi-user video calls, screen sharing with seamless camera switch-back and in-call live chat. WebRTC signaling (offers, answers, ICE candidates) via Socket.io, token auth with bcrypt, meeting history and guest join. Deployed on Render.',
    tech: ['React', 'Material UI', 'Node.js', 'Express', 'Socket.io', 'WebRTC', 'MongoDB'],
  },
  {
    title: 'Zerodha Clone – Trading Platform',
    description:
      'Full-stack trading platform from landing page to live dashboard with secure signup/login and protected routes. Live watchlist with Buy/Sell order execution, Holdings, Positions and Orders synced with a real backend, plus interactive portfolio charts. Deployed on Render.',
    tech: ['React', 'Node.js', 'Express', 'MongoDB', 'JWT', 'Chart.js'],
  },
  {
    title: 'Wanderlust – Accommodation Booking',
    description:
      'Airbnb-inspired booking app using MVC architecture, RESTful routing and session-based authentication with Passport.js. Cloudinary integrated for image uploads. Deployed live on Render.',
    tech: ['Node.js', 'Express', 'MongoDB', 'EJS', 'Passport.js', 'Cloudinary'],
  },
  {
    title: 'Allama Shibli Nomani Portfolio Website',
    description:
      'Official portfolio website for Allama Shibli Nomani with live Razorpay payments. Selected for this responsibility, awarded a certificate of appreciation, and won a prize and medal at a competition on 18 November 2025.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Razorpay'],
  },
  {
    title: 'Online Voting System',
    description:
      'Web-based voting platform with secure registration, login and vote casting. REST APIs for voting logic and result computation.',
    tech: ['SQL', '.NET', 'CSS'],
  },
];

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await Project.countDocuments();
    if (count > 0) {
      console.log(`Skipped: database me pehle se ${count} project(s) hain.`);
    } else {
      await Project.insertMany(projects);
      console.log(`${projects.length} projects add ho gaye.`);
    }
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();

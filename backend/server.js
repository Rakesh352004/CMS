const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const authMiddleware = require('./middleware/authMiddleware');
const complaintRoutes = require('./routes/complaint');
const createAdmin = require('./createAdmin');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/complaint', complaintRoutes);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: "Backend working" });
});

app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: "You are authorized",
    user: req.user
  });
});

// 🔥 Connect to MongoDB FIRST
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');

    // Ensure admin account exists and is configured as admin
    try {
      await createAdmin();
    } catch (error) {
      console.error('Could not create admin user:', error.message);
    }

    // Start server AFTER DB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch(err => console.log(err));
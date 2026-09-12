const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware setup
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, postman) or any origin in development
    if (!origin || process.env.NODE_ENV !== 'production' || origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return callback(null, true);
    }
    const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
    if (origin === allowedOrigin) {
      return callback(null, true);
    }
    return callback(null, true); // Allow local Wi-Fi connections
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Complaint Images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Hostel Complaint Management System REST API Service is healthy and active.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Catch-all
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 Hostel Complaint Management API Server running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`=======================================================`);

  try {
    const res = await db.query('SELECT NOW()');
    console.log('✅ Connected to PostgreSQL DB at:', res.rows[0].now);
  } catch (err) {
    console.error('⚠️ Warning: Could not connect to PostgreSQL database.', err.message);
    console.log('👉 Tip: Ensure PostgreSQL service is running and run database/schema.sql & database/seed.sql');
  }
});

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const manuscriptRoutes = require('./routes/manuscript');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/journal_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Add this to your backend/index.js file after the MongoDB connection

const { testEmailConnection } = require('./utils/emailService');

// Test email service on startup
const initializeServices = async () => {
  console.log('\n🚀 Initializing services...');
  
  // Test email service
  const emailWorking = await testEmailConnection();
  if (!emailWorking) {
    console.log('\n⚠️  EMAIL SERVICE SETUP REQUIRED:');
    console.log('1. Create a Gmail account or use existing one');
    console.log('2. Enable 2-Factor Authentication');
    console.log('3. Generate App Password: https://myaccount.google.com/apppasswords');
    console.log('4. Set environment variables:');
    console.log('   EMAIL_HOST=smtp.gmail.com');
    console.log('   EMAIL_PORT=587');
    console.log('   EMAIL_USER=your-email@gmail.com');
    console.log('   EMAIL_PASS=your-app-password');
    console.log('\n📝 Create a .env file with these variables or set them in your hosting environment\n');
  }
};

// Call this after MongoDB connection is established
db.once('open', async () => {
  console.log('Connected to MongoDB');
  await initializeServices();
});

// Also add a test email endpoint for debugging
app.get('/api/test-email', async (req, res) => {
  try {
    const { sendEmail } = require('./utils/emailService');
    
    const testEmail = req.query.email || process.env.EMAIL_USER;
    if (!testEmail) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email parameter: /api/test-email?email=your@email.com'
      });
    }

    await sendEmail({
      to: testEmail,
      template: 'passwordReset',
      data: {
        fullName: 'Test User',
        resetUrl: 'https://example.com/test-reset-link'
      }
    });

    res.json({
      success: true,
      message: `Test email sent successfully to ${testEmail}`
    });

  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({
      success: false,
      message: 'Test email failed',
      error: error.message
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/manuscripts', manuscriptRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global Error Handler:', error);
  
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📧 Email service configured: ${process.env.EMAIL_HOST || 'Not configured'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});
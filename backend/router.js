// Dummy router.js file to fix deployment error
// This file exists only to resolve potential import issues during deployment

const express = require('express');
const router = express.Router();

// Basic health check
router.get('/', (req, res) => {
  res.json({ 
    message: 'Router is working',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
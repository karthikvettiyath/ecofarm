const express = require('express');
const router = express.Router();
const db = require('../config/database');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', (req, res) => {
  // Query to get counts
  const queries = {
    cropRecommendations: 'SELECT COUNT(*) as count FROM croprecommendations',
    fertilizerAdvices: 'SELECT COUNT(*) as count FROM fertilizers', // Assuming fertilizers table exists
    yieldRecords: 'SELECT COUNT(*) as count FROM yieldrecords',
    newAlerts: 'SELECT COUNT(*) as count FROM alerts WHERE status = "new"' // Assuming alerts table
  };

  const results = {};

  // Execute queries in parallel
  const promises = Object.keys(queries).map(key => {
    return new Promise((resolve, reject) => {
      db.query(queries[key], (err, result) => {
        if (err) {
          console.error(`Error fetching ${key}:`, err);
          results[key] = 0; // Default to 0 on error
          resolve();
        } else {
          results[key] = result[0].count;
          resolve();
        }
      });
    });
  });

  Promise.all(promises).then(() => {
    res.json(results);
  });
});

module.exports = router;
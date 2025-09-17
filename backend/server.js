const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',       // Empty password for XAMPP
    database: 'eco_farm_manager',
    port: 3306
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
    } else {
        console.log('✅ Connected to MySQL database');
    }
});

// Route logging middleware (optional for debugging)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// 🌱 CROP RECOMMENDATIONS API
app.get('/api/crops', (req, res) => {
    const { soilType, temperature, rainfall } = req.query;
    
    const sql = `
        SELECT recommended_crop, crop_details
        FROM croprecommendations
        WHERE soil_type = ? AND temperature <= ? AND rainfall <= ?
        ORDER BY temperature DESC, rainfall DESC
        LIMIT 5
    `;
    
    db.query(sql, [soilType, temperature, rainfall], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// 💧 FERTILIZER RECOMMENDATIONS API
app.get('/api/fertilizers', (req, res) => {
    const { soilType, cropType, nutrientDeficiency } = req.query;
    
    const sql = `
        SELECT fertilizer_type, application_method, dosage, benefits, timing
        FROM fertilizer_recommendations
        WHERE soil_type = ? AND crop_type = ? AND nutrient_deficiency = ?
        ORDER BY effectiveness DESC
        LIMIT 5
    `;
    
    db.query(sql, [soilType, cropType, nutrientDeficiency], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// 📊 YIELD RECORDS API

// GET all yield records
app.get('/api/yield-records', (req, res) => {
    const sql = `
        SELECT * FROM yield_records 
        ORDER BY harvest_date DESC 
        LIMIT 100
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// GET yield records by crop type
app.get('/api/yield-records/crop/:cropType', (req, res) => {
    const { cropType } = req.params;
    
    const sql = `
        SELECT * FROM yield_records 
        WHERE crop_type = ? 
        ORDER BY harvest_date DESC
    `;
    
    db.query(sql, [cropType], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

// POST new yield record
app.post('/api/yield-records', (req, res) => {
    const { cropType, variety, plantingDate, harvestDate, yieldAmount, yieldUnit, notes } = req.body;
    
    const sql = `
        INSERT INTO yield_records (crop_type, variety, planting_date, harvest_date, yield_amount, yield_unit, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [cropType, variety, plantingDate, harvestDate, yieldAmount, yieldUnit, notes], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Yield record added successfully!', id: results.insertId });
    });
});

// DELETE yield record
app.delete('/api/yield-records/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'DELETE FROM yield_records WHERE id = ?';
    
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Yield record deleted successfully!' });
    });
});

// 📈 DASHBOARD STATISTICS API
app.get('/api/dashboard/stats', (req, res) => {
    const statsQueries = {
        totalCrops: 'SELECT COUNT(*) as count FROM croprecommendations',
        totalFertilizers: 'SELECT COUNT(*) as count FROM fertilizer_recommendations',
        totalYieldRecords: 'SELECT COUNT(*) as count FROM yield_records',
        recentYields: 'SELECT crop_type, yield_amount, yield_unit FROM yield_records ORDER BY harvest_date DESC LIMIT 5'
    };

    // Execute all queries
    db.query(`
        SELECT 
            (SELECT COUNT(*) FROM croprecommendations) as totalCrops,
            (SELECT COUNT(*) FROM fertilizer_recommendations) as totalFertilizers,
            (SELECT COUNT(*) FROM yield_records) as totalYieldRecords
    `, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        // Get recent yields
        db.query('SELECT crop_type, yield_amount, yield_unit FROM yield_records ORDER BY harvest_date DESC LIMIT 5', 
        (err, yields) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            
            res.json({
                ...results[0],
                recentYields: yields
            });
        });
    });
});

// 🏠 HEALTH CHECK API
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Eco-Farm Server is running', 
        timestamp: new Date().toISOString(),
        database: 'Connected' 
    });
});

// 📋 GET all soil types
app.get('/api/soil-types', (req, res) => {
    const sql = 'SELECT DISTINCT soil_type FROM croprecommendations ORDER BY soil_type';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results.map(row => row.soil_type));
    });
});

// 📋 GET all crop types
app.get('/api/crop-types', (req, res) => {
    const sql = 'SELECT DISTINCT crop_type FROM fertilizer_recommendations ORDER BY crop_type';
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results.map(row => row.crop_type));
    });
});

// ==================== KNOWLEDGE BASE API ENDPOINTS ====================

// GET all knowledge base articles
app.get('/api/knowledge-base', (req, res) => {
  const { category, search } = req.query;
  
  let sql = `SELECT * FROM knowledge_base WHERE 1=1`;
  let params = [];

  if (category && category !== 'all') {
    sql += ` AND category = ?`;
    params.push(category);
  }

  if (search) {
    sql += ` AND (title LIKE ? OR content LIKE ? OR tags LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  sql += ` ORDER BY created_at DESC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// GET article by ID
app.get('/api/knowledge-base/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = `SELECT * FROM knowledge_base WHERE id = ?`;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json(results[0]);
  });
});

// GET all categories
app.get('/api/knowledge-base/categories', (req, res) => {
  const sql = `SELECT DISTINCT category FROM knowledge_base ORDER BY category`;
  
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results.map(row => row.category));
  });
});

// POST new article (admin functionality)
app.post('/api/knowledge-base', (req, res) => {
  const { title, content, category, tags, author } = req.body;
  
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content, and category are required' });
  }

  const sql = `
    INSERT INTO knowledge_base (title, content, category, tags, author)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(sql, [title, content, category, tags, author], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Article created successfully!', id: results.insertId });
  });
});

// PUT update article
app.put('/api/knowledge-base/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, category, tags } = req.body;
  
  const sql = `
    UPDATE knowledge_base 
    SET title = ?, content = ?, category = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  
  db.query(sql, [title, content, category, tags, id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Article updated successfully!' });
  });
});

// DELETE article
app.delete('/api/knowledge-base/:id', (req, res) => {
  const { id } = req.params;
  
  const sql = `DELETE FROM knowledge_base WHERE id = ?`;
  
  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    res.json({ message: 'Article deleted successfully!' });
  });
});

// ==================== END KNOWLEDGE BASE API ENDPOINTS ====================

// Default route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Eco-Farm Manager API', 
        version: '1.0.0',
        endpoints: {
            crops: '/api/crops',
            fertilizers: '/api/fertilizers',
            yieldRecords: '/api/yield-records',
            knowledgeBase: '/api/knowledge-base',
            dashboard: '/api/dashboard/stats',
            health: '/api/health'
        }
    });
});

// Error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler (must be LAST - after all other routes)
app.use((req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌱 Crop API: http://localhost:${PORT}/api/crops`);
    console.log(`💧 Fertilizer API: http://localhost:${PORT}/api/fertilizers`);
    console.log(`📈 Yield Records API: http://localhost:${PORT}/api/yield-records`);
    console.log(`📚 Knowledge Base API: http://localhost:${PORT}/api/knowledge-base`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    db.end();
    process.exit(0);
});
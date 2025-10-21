const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple admin check via header
function requireAdmin(req, res, next) {
    const isAdmin = req.headers['x-admin-auth'];
    if (isAdmin === 'true') return next();
    return res.status(401).json({ error: 'Unauthorized' });
}

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1 as ok');
        res.json({ status: 'OK', db: rows[0].ok === 1 });
    } catch (e) {
        res.status(500).json({ status: 'ERROR', db: false, message: e.message });
    }
});

// Chatbot stub
app.post('/api/chatbot', (req, res) => {
    const message = (req.body && req.body.message) || '';
    const response = message
        ? `Thanks for your message about "${message}". Here are some quick tips:\n\n- Keep soil moist but not waterlogged\n- Check local weather before planting\n- Rotate crops to maintain soil health`
        : 'Hello! Ask me about crops, fertilizers, or schedules.';
    res.json({ response });
});

// Farmer registration
app.post('/api/register', async (req, res) => {
    try {
        const { name, phone, location, password } = req.body;

        // Validation
        if (!name || !phone || !location || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ error: 'Password must be at least 6 characters long' });
        }

        if (!/^\d{10}$/.test(phone)) {
            return res.status(400).json({ error: 'Phone number must be 10 digits' });
        }

        // Check if phone already exists
        const [existing] = await pool.query('SELECT id FROM farmers WHERE phone = ?', [phone]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Phone number already registered' });
        }

        // Insert new farmer
        const [result] = await pool.query(
            'INSERT INTO farmers (name, phone, location, password, created_at) VALUES (?, ?, ?, ?, NOW())',
            [name, phone, location, password]
        );

        res.json({ 
            success: true, 
            message: 'Registration successful',
            farmerId: result.insertId
        });
    } catch (e) {
        console.error('Registration error:', e);
        res.status(500).json({ error: 'Registration failed' });
    }
});

// Dashboard stats
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const [[{ totalCrops }]] = await pool.query('SELECT COUNT(*) as totalCrops FROM croprecommendations');
    const [[{ totalFertilizers }]] = await pool.query('SELECT COUNT(*) as totalFertilizers FROM fertilizer_recommendations');
    const [[{ totalYieldRecords }]] = await pool.query('SELECT COUNT(*) as totalYieldRecords FROM yield_records');
    const [[{ totalAlerts }]] = await pool.query('SELECT COUNT(*) as totalAlerts FROM alerts');
    const [[{ totalUsers }]] = await pool.query('SELECT COUNT(*) as totalUsers FROM farmers');
    const [[{ totalFAQs }]] = await pool.query('SELECT COUNT(*) as totalFAQs FROM faqs');
    const [[{ totalKnowledgeBase }]] = await pool.query('SELECT COUNT(*) as totalKnowledgeBase FROM knowledge_base');
    const [[{ totalCropCalendar }]] = await pool.query('SELECT COUNT(*) as totalCropCalendar FROM crop_calendar');
    const [recentYields] = await pool.query('SELECT crop_type, yield_amount, yield_unit FROM yield_records ORDER BY created_at DESC LIMIT 5');
    res.json({ totalCrops, totalFertilizers, totalYieldRecords, totalAlerts, totalUsers, totalFAQs, totalKnowledgeBase, totalCropCalendar, recentYields });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});// Public: Alerts
app.get('/api/alerts', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public: FAQs
app.get('/api/faqs', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, question, answer, category FROM faqs WHERE status IS NULL OR status = "active" ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public: Crop calendar list + filters
app.get('/api/crop-calendar', async (req, res) => {
    try {
        const { season, region } = req.query;
        let sql = 'SELECT * FROM crop_calendar';
        const params = [];
        const clauses = [];
        if (season) {
            clauses.push('(planting_season LIKE ? OR harvesting_season LIKE ?)');
            params.push(`%${season}%`, `%${season}%`);
        }
        if (region) {
            clauses.push('region LIKE ?');
            params.push(`%${region}%`);
        }
        if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
        sql += ' ORDER BY crop_name ASC';
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public: Crop calendar by id
app.get('/api/crop-calendar/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM crop_calendar WHERE id = ?', [req.params.id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public: Crop recommendations
app.get('/api/crops', async (req, res) => {
    try {
        const { soilType, temperature, rainfall } = req.query;
        const [rows] = await pool.query(
            `SELECT * FROM croprecommendations 
             WHERE (? IS NULL OR LOWER(soil_type) = LOWER(?))
                 AND (? IS NULL OR temperature <= ? + 5)
                 AND (? IS NULL OR rainfall <= ? + 50)
             ORDER BY created_at DESC LIMIT 50`,
            [soilType || null, soilType || null, temperature || null, temperature || null, rainfall || null, rainfall || null]
        );
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public: Fertilizer recommendations
app.get('/api/fertilizers', async (req, res) => {
    try {
        const { soilType, cropType, nutrientDeficiency } = req.query;
        const [rows] = await pool.query(
            `SELECT * FROM fertilizer_recommendations
             WHERE (? IS NULL OR LOWER(soil_type) = LOWER(?))
                 AND (? IS NULL OR LOWER(crop_type) = LOWER(?))
                 AND (? IS NULL OR LOWER(nutrient_deficiency) = LOWER(?))
             ORDER BY effectiveness DESC, created_at DESC LIMIT 100`,
            [soilType || null, soilType || null, cropType || null, cropType || null, nutrientDeficiency || null, nutrientDeficiency || null]
        );
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Public: Knowledge base
app.get('/api/knowledge-base', async (req, res) => {
    try {
        const { category, search } = req.query;
        let sql = 'SELECT id, title, content, category, IFNULL(author, "Admin") as author, IFNULL(views, 0) as views, created_at FROM knowledge_base';
        const params = [];
        const where = [];
        if (category) { where.push('category = ?'); params.push(category); }
        if (search) { where.push('(title LIKE ? OR content LIKE ?)'); params.push(`%${search}%`, `%${search}%`); }
        if (where.length) sql += ' WHERE ' + where.join(' AND ');
        sql += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(sql, params);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/knowledge-base/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT DISTINCT category FROM knowledge_base WHERE category IS NOT NULL ORDER BY category');
        res.json(rows.map(r => r.category));
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/knowledge-base/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query('SELECT id, title, content, category, IFNULL(author, "Admin") as author, IFNULL(views,0) as views, created_at FROM knowledge_base WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        // Increment views
        await pool.query('UPDATE knowledge_base SET views = IFNULL(views,0) + 1 WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Search endpoint (simple across multiple tables)
app.get('/api/search', async (req, res) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) return res.json([]);
        const like = `%${q}%`;
        const [kb] = await pool.query('SELECT id, title as label, category as type FROM knowledge_base WHERE title LIKE ? OR content LIKE ? LIMIT 10', [like, like]);
        const [faq] = await pool.query('SELECT id, question as label, "faq" as type FROM faqs WHERE question LIKE ? OR answer LIKE ? LIMIT 10', [like, like]);
        const [alerts] = await pool.query('SELECT id, title as label, type FROM alerts WHERE title LIKE ? OR message LIKE ? LIMIT 10', [like, like]);
        res.json([...kb, ...faq, ...alerts]);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Yield records
app.get('/api/yield-records', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM yield_records ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/yield-records/crop/:cropType', async (req, res) => {
    try {
        const cropType = req.params.cropType;
        const [rows] = await pool.query('SELECT * FROM yield_records WHERE LOWER(crop_type) = LOWER(?) ORDER BY created_at DESC', [cropType]);
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/yield-records', async (req, res) => {
    try {
        const { cropType, variety, plantingDate, harvestDate, yieldAmount, yieldUnit, notes } = req.body || {};
        if (!cropType || !plantingDate || !harvestDate || !yieldAmount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const [result] = await pool.query(
            `INSERT INTO yield_records (crop_type, variety, planting_date, harvest_date, yield_amount, yield_unit, notes)
             VALUES (?,?,?,?,?,?,?)`,
            [cropType, variety || null, plantingDate, harvestDate, yieldAmount, yieldUnit || 'kg/ha', notes || null]
        );
        res.status(201).json({ id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/yield-records/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM yield_records WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: FAQs CRUD
app.get('/api/admin/faqs', requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, question, answer, category, IFNULL(status, "active") as status, created_at FROM faqs ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/faqs', requireAdmin, async (req, res) => {
    try {
        const { question, answer, category, status } = req.body || {};
        if (!question || !answer) return res.status(400).json({ error: 'Question and answer are required' });
        const [result] = await pool.query('INSERT INTO faqs (question, answer, category, status) VALUES (?,?,?,?)', [question, answer, category || null, status || 'active']);
        res.status(201).json({ id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
    try {
        const { question, answer, category, status } = req.body || {};
        await pool.query('UPDATE faqs SET question = ?, answer = ?, category = ?, status = ? WHERE id = ?', [question, answer, category || null, status || 'active', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/faqs/:id', requireAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: Alerts CRUD
app.get('/api/admin/alerts', requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM alerts ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/alerts', requireAdmin, async (req, res) => {
    try {
        const { title, message, type, status } = req.body || {};
        if (!title) return res.status(400).json({ error: 'Title is required' });
        const [result] = await pool.query('INSERT INTO alerts (title, message, type, status) VALUES (?,?,?,?)', [title, message || null, type || 'info', status || 'new']);
        res.status(201).json({ id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/alerts/:id', requireAdmin, async (req, res) => {
    try {
        const { title, message, type, status } = req.body || {};
        await pool.query('UPDATE alerts SET title = ?, message = ?, type = ?, status = ? WHERE id = ?', [title, message || null, type || 'info', status || 'new', req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/alerts/:id', requireAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM alerts WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: Crop calendar CRUD
app.get('/api/admin/crop-calendar', requireAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM crop_calendar ORDER BY created_at DESC');
        res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/crop-calendar', requireAdmin, async (req, res) => {
    try {
        const { crop_name, scientific_name, planting_season, harvesting_season, duration_days, soil_type, temperature_range, rainfall_requirement, key_activities, optimal_conditions, region } = req.body || {};
        if (!crop_name || !planting_season || !harvesting_season) return res.status(400).json({ error: 'Missing required fields' });
        const [result] = await pool.query(
            `INSERT INTO crop_calendar (crop_name, scientific_name, planting_season, harvesting_season, duration_days, soil_type, temperature_range, rainfall_requirement, key_activities, optimal_conditions, region)
             VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
            [crop_name, scientific_name || null, planting_season, harvesting_season, duration_days || null, soil_type || null, temperature_range || null, rainfall_requirement || null, key_activities || null, optimal_conditions || null, region || null]
        );
        res.status(201).json({ id: result.insertId });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/crop-calendar/:id', requireAdmin, async (req, res) => {
    try {
        const { crop_name, scientific_name, planting_season, harvesting_season, duration_days, soil_type, temperature_range, rainfall_requirement, key_activities, optimal_conditions, region } = req.body || {};
        await pool.query(
            `UPDATE crop_calendar SET crop_name=?, scientific_name=?, planting_season=?, harvesting_season=?, duration_days=?, soil_type=?, temperature_range=?, rainfall_requirement=?, key_activities=?, optimal_conditions=?, region=? WHERE id=?`,
            [crop_name, scientific_name || null, planting_season, harvesting_season, duration_days || null, soil_type || null, temperature_range || null, rainfall_requirement || null, key_activities || null, optimal_conditions || null, region || null, req.params.id]
        );
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/crop-calendar/:id', requireAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM crop_calendar WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: Farmers (users)
app.get('/api/admin/farmers', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM farmers ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Analytics data
app.get('/api/admin/analytics', requireAdmin, async (req, res) => {
  try {
    const [yieldStats] = await pool.query(`
      SELECT crop_type, COUNT(*) as count, AVG(yield_amount) as avg_yield, MAX(yield_amount) as max_yield
      FROM yield_records
      GROUP BY crop_type
      ORDER BY count DESC
      LIMIT 10
    `);
    const [userGrowth] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM farmers
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    res.json({ yieldStats, userGrowth });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Admin: Settings CRUD
app.get('/api/admin/settings', requireAdmin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM settings ORDER BY category, setting_key');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/settings/:id', requireAdmin, async (req, res) => {
  try {
    const { setting_value } = req.body || {};
    await pool.query('UPDATE settings SET setting_value = ? WHERE id = ?', [setting_value, req.params.id]);
    res.json({ success: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Default root
app.get('/', (req, res) => {
    res.json({
        message: 'Eco-Farm Manager API',
        version: '1.0.0',
        endpoints: [
            'GET /api/health',
            'GET /api/alerts',
            'GET /api/faqs',
            'GET /api/crop-calendar',
            'GET /api/knowledge-base',
            'GET /api/yield-records'
        ]
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Ensure required columns exist (idempotent startup migration)
async function columnExists(table, column) {
    const [rows] = await pool.query(
        `SELECT COUNT(*) as cnt FROM INFORMATION_SCHEMA.COLUMNS 
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
        [table, column]
    );
    return rows[0].cnt > 0;
}

async function columnExists(table, column) {
    const [rows] = await pool.query(`
        SELECT COUNT(*) as cnt 
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ? 
        AND COLUMN_NAME = ?
    `, [table, column]);
    return rows[0].cnt > 0;
}

// Process diagnostics
process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled promise rejection:', reason);
});
process.on('exit', (code) => {
    console.log('Process exiting with code:', code);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})
.catch((e) => {
    console.error('Startup error:', e);
    process.exit(1);
});
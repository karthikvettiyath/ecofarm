const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mysql = require('mysql');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // XAMPP default username
  password: '',       // XAMPP default EMPTY password
  database: 'eco_farm_manager',
  port: 3306          // XAMPP MySQL port
});

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
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/farmers', require('./routes/farmers'));
app.use('/api/crops', require('./routes/crops'));
app.use('/api/fertilizers', require('./routes/fertilizers'));
app.use('/api/yields', require('./routes/yields'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/feedback', require('./routes/feedback'));


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


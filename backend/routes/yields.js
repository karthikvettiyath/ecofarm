
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// POST /api/yields - Add a new yield record
router.post('/', (req, res) => {
	const { farmer_id, crop, yield_quantity, season } = req.body;
	if (!farmer_id || !crop || !yield_quantity || !season) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	const sql = `INSERT INTO yieldrecords (farmer_id, crop, yield_quantity, season) VALUES (?, ?, ?, ?)`;
	db.query(sql, [farmer_id, crop, yield_quantity, season], (err, result) => {
		if (err) {
			console.error('Error inserting yield record:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		res.status(201).json({ message: 'Yield record added successfully', yield_id: result.insertId });
	});
});

// Optionally: GET /api/yields - List all yield records (for frontend display)
router.get('/', (req, res) => {
	const sql = `SELECT * FROM yieldrecords ORDER BY created_at DESC`;
	db.query(sql, (err, results) => {
		if (err) {
			console.error('Error fetching yield records:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		res.json(results);
	});
});

module.exports = router;

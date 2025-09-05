const db = require('../config/database');
const bcrypt = require('bcryptjs');

const Farmer = {
  create: async (farmerData) => {
    const { name, phone, location, password } = farmerData;
    const hashedPassword = await bcrypt.hash(password, 8);
    const query = 'INSERT INTO farmers (name, phone, location, password) VALUES (?, ?, ?, ?)';
    return new Promise((resolve, reject) => {
      db.query(query, [name, phone, location, hashedPassword], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  findByPhone: async (phone) => {
    const query = 'SELECT * FROM farmers WHERE phone = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [phone], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  findById: async (id) => {
    const query = 'SELECT farmer_id, name, phone, location FROM farmers WHERE farmer_id = ?';
    return new Promise((resolve, reject) => {
      db.query(query, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  }
};

module.exports = Farmer;
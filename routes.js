const express = require('express');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
require('dotenv').config();

const router = express.Router();

// MySQL connection pool (use same env variable as server.js)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Middleware to validate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Helper to handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

/* ---------- AUTH ROUTES ---------- */
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars')
  ],
  handleValidation,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const [rows] = await pool.execute(
        'SELECT id, email, password_hash, role FROM users WHERE email = ?',
        [email]
      );
      if (rows.length === 0)
        return res.status(401).json({ error: 'Invalid credentials' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match)
        return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

/* ---------- CLIENTS ROUTES ---------- */
router.get('/clients', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post(
  '/clients',
  authenticateToken,
  [
    body('first_name').notEmpty().withMessage('First name required'),
    body('last_name').notEmpty().withMessage('Last name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').optional().isString(),
    body('address').optional().isString()
  ],
  handleValidation,
  async (req, res) => {
    const { first_name, last_name, email, phone, address } = req.body;
    try {
      const [result] = await pool.execute(
        `INSERT INTO clients (first_name, last_name, email, phone, address)
         VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, phone || null, address || null]
      );

      const insertedId = result.insertId;
      const [newClientRows] = await pool.execute('SELECT * FROM clients WHERE id = ?', [insertedId]);
      res.status(201).json(newClientRows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
);

module.exports = router;
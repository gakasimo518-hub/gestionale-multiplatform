require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// Global error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);
  if (res.headersSent) return next(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
};

/* ---------- AUTH ROUTE ---------- */
app.post(
  '/api/auth/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { email, password } = req.body;
      const [rows] = await pool.execute(
        'SELECT id, email, password_hash, role FROM users WHERE email = ?',
        [email]
      );

      if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      const tokenPayload = { id: user.id, email: user.email, role: user.role };
      const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
);

/* ---------- CLIENTS CRUD ---------- */
app.get('/api/clients', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

app.post(
  '/api/clients',
  authenticateToken,
  [
    body('first_name').notEmpty().withMessage('First name required'),
    body('last_name').notEmpty().withMessage('Last name required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('phone').optional().isString(),
    body('address').optional().isString()
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

      const { first_name, last_name, email, phone, address } = req.body;
      const [result] = await pool.execute(
        `INSERT INTO clients (first_name, last_name, email, phone, address)
         VALUES (?, ?, ?, ?, ?)`,
        [first_name, last_name, email, phone || null, address || null]
      );

      const insertedId = result.insertId;
      const [newClientRows] = await pool.execute('SELECT * FROM clients WHERE id = ?', [insertedId]);
      res.status(201).json(newClientRows[0]);
    } catch (err) {
      next(err);
    }
  }
);

// Attach global error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
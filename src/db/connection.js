const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'gestionale',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = {
  pool,
  /**
   * Execute a query with optional parameters.
   * @param {string} sql - The SQL query string.
   * @param {Array} [params] - Optional array of parameters.
   * @returns {Promise<Array>} - Resolves to the rows returned by the query.
   */
  query: async (sql, params = []) => {
    const [rows] = await pool.execute(sql, params);
    return rows;
  },

  /**
   * Get a single connection from the pool.
   * @returns {Promise<Connection>} - Resolves to a MySQL connection.
   */
  getConnection: async () => {
    return await pool.getConnection();
  },

  /**
   * Close all connections in the pool.
   * @returns {Promise<void>}
   */
  closePool: async () => {
    await pool.end();
  },
};
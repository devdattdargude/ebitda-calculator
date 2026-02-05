const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL live database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'ebitda_calculator',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log(`[DB] Query executed in ${duration}ms: ${text.substring(0, 100)}...`);
      return res;
    } catch (error) {
      console.error(`[DB] Query failed: ${text.substring(0, 100)}...`, error);
      throw error;
    }
  },
  
  // Health check method
  healthCheck: async () => {
    try {
      const result = await pool.query('SELECT NOW()');
      return { status: 'healthy', timestamp: result.rows[0].now };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },
  
  // Close connection pool
  close: async () => {
    await pool.end();
  }
};

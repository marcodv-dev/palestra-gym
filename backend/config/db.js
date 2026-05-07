import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Supporta sia DATABASE_URL (Render) che variabili singole (locale)
const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || 'gym_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

export const pool = pool;

export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('MySQL connected successfully');
    conn.release();
    return true;
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
    return false;
  }
};

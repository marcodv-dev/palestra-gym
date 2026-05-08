import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const dbConfig = () => {
  if (process.env.DATABASE_URL) {
    const url = new URL(process.env.DATABASE_URL);
    const sslMode = url.searchParams.get('ssl-mode');
    url.searchParams.delete('ssl-mode');
    return {
      uri: url.toString().replace(/\/$/, ''),
      ...(sslMode && { ssl: {} })
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'gym_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
};

const config = dbConfig();
export const pool = config.uri
  ? mysql.createPool(config.uri)
  : mysql.createPool(config);

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

export const initSchema = async () => {
  try {
    const conn = await pool.getConnection();
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    try { await conn.query('ALTER TABLE users DROP COLUMN username'); } catch (_) {}
    await conn.query(`
      CREATE TABLE IF NOT EXISTS types (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE KEY unique_type_per_user (name, user_id)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS exercises (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        type_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        reps VARCHAR(50),
        sets VARCHAR(50),
        peso VARCHAR(50),
        order_index INT DEFAULT 0,
        done BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (type_id) REFERENCES types(id) ON DELETE CASCADE,
        INDEX idx_user_type (user_id, type_id),
        INDEX idx_order (order_index)
      )
    `);
    await conn.query(`
      CREATE TABLE IF NOT EXISTS workout_logs (
        id INT PRIMARY KEY AUTO_INCREMENT,
        exercise_id INT NOT NULL,
        done_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
        INDEX idx_exercise (exercise_id),
        INDEX idx_done_at (done_at)
      )
    `);
    conn.release();
    console.log('Database schema initialized');
  } catch (err) {
    console.error('Schema init failed:', err.message);
  }
};

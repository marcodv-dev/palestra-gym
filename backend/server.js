import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { pool, testConnection, initSchema } from './config/db.js';

const PORT = process.env.PORT || 3001;

const start = async () => {
  const connected = await testConnection();
  if (!connected) {
    console.error('Impossibile connettersi al database. Controlla le credenziali in .env');
    process.exit(1);
  }

  await initSchema();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
};

start();

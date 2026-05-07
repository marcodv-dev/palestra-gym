import express from 'express';
import corsMiddleware from './middleware/cors.js';
import authRoutes from './routes/auth.js';
import typeRoutes from './routes/types.js';
import exerciseRoutes from './routes/exercises.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/types', typeRoutes);
app.use('/api/exercises', exerciseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;

import { pool } from '../config/db.js';

export const getExercises = async (req, res) => {
  try {
    const [exercises] = await pool.query(
      'SELECT * FROM exercises WHERE user_id = ? ORDER BY type_id, order_index',
      [req.userId]
    );
    res.json(exercises);
  } catch (err) {
    console.error('Get exercises error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const getExercisesOfType = async (req, res) => {
  try {
    const { typeId } = req.params;

    const [exercises] = await pool.query(
      'SELECT * FROM exercises WHERE user_id = ? AND type_id = ? ORDER BY order_index',
      [req.userId, typeId]
    );

    res.json(exercises);
  } catch (err) {
    console.error('Get exercises by type error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;

    const [exercises] = await pool.query(
      'SELECT * FROM exercises WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (exercises.length === 0) {
      return res.status(404).json({ error: 'Esercizio non trovato' });
    }

    res.json(exercises[0]);
  } catch (err) {
    console.error('Get exercise error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const addExercise = async (req, res) => {
  try {
    const { type_id, name, order_index } = req.body;

    if (!type_id || !name) {
      return res.status(400).json({ error: 'type_id e name richiesti' });
    }

    const { reps, sets, peso } = req.body;

    const [result] = await pool.query(
      'INSERT INTO exercises (user_id, type_id, name, reps, sets, peso, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, type_id, name, reps || null, sets || null, peso || null, order_index || 0]
    );

    res.status(201).json({
      id: result.insertId,
      user_id: req.userId,
      type_id,
      name,
      reps: reps || null,
      sets: sets || null,
      peso: peso || null,
      order_index: order_index || 0,
      done: false
    });
  } catch (err) {
    console.error('Add exercise error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const { type_id, name, reps, sets, peso, order_index, done } = req.body;

    const [result] = await pool.query(
      `UPDATE exercises 
       SET type_id = ?, name = ?, reps = ?, sets = ?, peso = ?, order_index = ?, done = ?
       WHERE id = ? AND user_id = ?`,
      [type_id, name, reps || null, sets || null, peso || null, order_index, done, id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Esercizio non trovato' });
    }

    res.json({ message: 'Esercizio aggiornato' });
  } catch (err) {
    console.error('Update exercise error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM exercises WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Esercizio non trovato' });
    }

    res.json({ message: 'Esercizio eliminato' });
  } catch (err) {
    console.error('Delete exercise error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const deleteExercisesByType = async (req, res) => {
  try {
    const { typeId } = req.params;

    await pool.query(
      'DELETE FROM exercises WHERE type_id = ? AND user_id = ?',
      [typeId, req.userId]
    );

    res.json({ message: 'Esercizi eliminati' });
  } catch (err) {
    console.error('Delete exercises by type error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const markExerciseDone = async (req, res) => {
  try {
    const { id } = req.params;

    const [exercises] = await pool.query(
      'SELECT id, done FROM exercises WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (exercises.length === 0) {
      return res.status(404).json({ error: 'Esercizio non trovato' });
    }

    const exercise = exercises[0];

    if (exercise.done) {
      // Deseleziona: rimuovi l'ultimo workout_log e imposta done = FALSE
      const [logs] = await pool.query(
        'SELECT id FROM workout_logs WHERE exercise_id = ? ORDER BY done_at DESC LIMIT 1',
        [id]
      );

      if (logs.length > 0) {
        await pool.query(
          'DELETE FROM workout_logs WHERE id = ?',
          [logs[0].id]
        );
      }

      await pool.query(
        'UPDATE exercises SET done = FALSE WHERE id = ?',
        [id]
      );

      res.json({ message: 'Esercizio deselezionato', done: false });
    } else {
      // Seleziona: aggiungi log e imposta done = TRUE
      await pool.query(
        'INSERT INTO workout_logs (exercise_id) VALUES (?)',
        [id]
      );

      await pool.query(
        'UPDATE exercises SET done = TRUE WHERE id = ?',
        [id]
      );

      res.json({ message: 'Esercizio completato', done: true });
    }
  } catch (err) {
    console.error('Mark done error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const getStats = async (req, res) => {
  try {
    const userId = req.userId;

    const [[{ total_workouts }]] = await pool.query(
      `SELECT COUNT(DISTINCT DATE(wl.done_at)) as total_workouts
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE e.user_id = ?`,
      [userId]
    );

    const [[{ total_exercises_done }]] = await pool.query(
      `SELECT COUNT(*) as total_exercises_done
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE e.user_id = ?`,
      [userId]
    );

    const [[{ total_types }]] = await pool.query(
      'SELECT COUNT(*) as total_types FROM types WHERE user_id = ?',
      [userId]
    );

    const [perMonth] = await pool.query(
      `SELECT DATE_FORMAT(wl.done_at, '%Y-%m') as month,
       COUNT(DISTINCT DATE(wl.done_at)) as count
       FROM workout_logs wl
       JOIN exercises e ON wl.exercise_id = e.id
       WHERE e.user_id = ?
       GROUP BY month
       ORDER BY month`,
      [userId]
    );

    const labels = perMonth.map(m => {
      const d = new Date(m.month + '-01');
      return d.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
    });

    const avg = perMonth.length > 0
      ? perMonth.reduce((sum, m) => sum + m.count, 0) / perMonth.length
      : 0;

    res.json({
      total_workouts,
      total_exercises_done,
      total_types,
      per_month: perMonth.map((m, i) => ({
        key: m.month,
        label: labels[i],
        count: m.count
      })),
      avg_per_month: avg
    });
  } catch (err) {
    console.error('Get stats error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

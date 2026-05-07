import { pool } from '../config/db.js';

export const getTypes = async (req, res) => {
  try {
    const [types] = await pool.query(
      'SELECT * FROM types WHERE user_id = ? ORDER BY name',
      [req.userId]
    );
    res.json(types);
  } catch (err) {
    console.error('Get types error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const addType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nome tipo richiesto' });
    }

    const [result] = await pool.query(
      'INSERT INTO types (user_id, name) VALUES (?, ?)',
      [req.userId, name]
    );

    res.status(201).json({ id: result.insertId, user_id: req.userId, name });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Tipo già esistente' });
    }
    console.error('Add type error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

export const deleteType = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM types WHERE id = ? AND user_id = ?',
      [id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Tipo non trovato' });
    }

    res.json({ message: 'Tipo eliminato' });
  } catch (err) {
    console.error('Delete type error:', err);
    res.status(500).json({ error: 'Errore del server' });
  }
};

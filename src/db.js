// Supporta sia sviluppo locale che produzione
const API = import.meta.env.VITE_API_URL || '/api';

let token = localStorage.getItem('token');

export const setToken = (t) => {
  token = t;
  if (t) localStorage.setItem('token', t);
  else localStorage.removeItem('token');
};

const authHeader = () => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` })
});

const handleResponse = async (res) => {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Errore del server' }));
    throw new Error(err.error || 'Errore del server');
  }
  return res.json();
};

export const login = async (email, password) => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data.token) setToken(data.token);
  return data;
};

export const register = async (email, password) => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await handleResponse(res);
  if (data.token) setToken(data.token);
  return data;
};

export const logout = () => {
  setToken(null);
};

export const isAuthenticated = () => !!token;

export const getTypes = async () => {
  const res = await fetch(`${API}/types`, { headers: authHeader() });
  return handleResponse(res);
};

export const addType = async (name) => {
  const res = await fetch(`${API}/types`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify({ name })
  });
  return handleResponse(res);
};

export const deleteType = async (id) => {
  const res = await fetch(`${API}/types/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return handleResponse(res);
};

export const getExercises = async () => {
  const res = await fetch(`${API}/exercises`, { headers: authHeader() });
  return handleResponse(res);
};

export const getExercisesOfType = async (typeId) => {
  const res = await fetch(`${API}/exercises/type/${typeId}`, { headers: authHeader() });
  return handleResponse(res);
};

export const getExerciseById = async (id) => {
  const res = await fetch(`${API}/exercises/${id}`, { headers: authHeader() });
  return handleResponse(res);
};

export const addExerciseDB = async (exercise) => {
  const res = await fetch(`${API}/exercises`, {
    method: 'POST',
    headers: authHeader(),
    body: JSON.stringify(exercise)
  });
  return handleResponse(res);
};

export const updateExerciseDB = async (exercise) => {
  const res = await fetch(`${API}/exercises/${exercise.id}`, {
    method: 'PUT',
    headers: authHeader(),
    body: JSON.stringify(exercise)
  });
  return handleResponse(res);
};

export const deleteExerciseDB = async (id) => {
  const res = await fetch(`${API}/exercises/${id}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return handleResponse(res);
};

export const deleteExercisesByType = async (typeId) => {
  const res = await fetch(`${API}/exercises/type/${typeId}`, {
    method: 'DELETE',
    headers: authHeader()
  });
  return handleResponse(res);
};

export const markExerciseDone = async (id) => {
  const res = await fetch(`${API}/exercises/${id}/done`, {
    method: 'POST',
    headers: authHeader()
  });
  return handleResponse(res);
};

export const completeWorkout = async () => {
  const res = await fetch(`${API}/exercises/complete`, {
    method: 'POST',
    headers: authHeader()
  });
  return handleResponse(res);
};

export const getTotalWorkouts = async () => {
  const data = await getStats();
  return data.total_workouts;
};

export const getTotalExercisesDone = async () => {
  const data = await getStats();
  return data.total_exercises_done;
};

export const getTotalTypes = async () => {
  const data = await getStats();
  return data.total_types;
};

export const getWorkoutsPerMonth = async () => {
  const data = await getStats();
  return data.per_month || [];
};

export const getAverageWorkoutsPerMonth = async () => {
  const data = await getStats();
  return data.avg_per_month || 0;
};

export const getStats = async () => {
  const res = await fetch(`${API}/exercises/stats`, { headers: authHeader() });
  return handleResponse(res);
};

export const exportAllExercises = async () => {
  const types = await getTypes();
  const exercises = await getExercises();
  const data = { types, exercises };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `gym-db-backup.json`;
  a.click();
  URL.revokeObjectURL(url);
};

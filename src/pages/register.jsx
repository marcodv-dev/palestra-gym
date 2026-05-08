import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, isAuthenticated } from '../db.js';
import { useLang } from '../i18n.jsx';

export default function Register() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container_aut">
      <div className="card">
        <label className="title-aut">{t('appTitle') || 'Gym'}</label>
        <label className="subtitle">{t('register') || 'Registrati'}</label>

        <form onSubmit={handleSubmit} className="form-aut">
          <input
            type="email"
            placeholder={t('email') || 'Email'}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            required
          />

          <input
            type="password"
            placeholder={t('password') || 'Password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            required
            minLength={6}
          />

          {error && <div className="error">{error}</div>}

          <button
            type="submit"
            className="button_aut"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : (t('register') || 'Registrati')}
          </button>
        </form>

        <button
          className="button_aut_nav"
          onClick={() => navigate('/login')}
        >
          {t('login') || 'Accedi'}
        </button>
      </div>
    </div>
  );
}

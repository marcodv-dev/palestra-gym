import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../db.js';
import { useLang } from '../i18n.jsx';

export default function Login() {
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
      await login(email, password);
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
        <label className="subtitle">{t('login') || 'Accedi'}</label>


        <form onSubmit={handleSubmit} className="form-aut">
          <input
            type="email"
            placeholder={t('email') || 'Email'}
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="input"
            required
            style={{border:`${error?'1px solid red':null}`}}
          />

          <input
            type="password"
            placeholder={t('password') || 'Password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="input"
            required
            style={{border:`${error?'1px solid red':null}`}}
          />
          
          {error && <div className="error">{error}</div>}
          
          <button
            type="submit"
            className="button_aut"
            disabled={loading}
          >
            {loading ? <div className="spinner" /> : (t('login') || 'Accedi')}
          </button>
        </form>

        <button
            className="button_aut_nav"
            onClick={() => navigate('/register')}
          >
            {t('register') || 'Registrati'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: '#f5f5f5'
  },
  card: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    fontSize: '1.5rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '1.2rem',
    marginBottom: '1.5rem',
    color: '#666'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  input: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem',
    borderRadius: '8px',
    border: 'none',
    background: '#007bff',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '0.5rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    textAlign: 'center'
  },
  link: {
    textAlign: 'center',
    marginTop: '1rem',
    color: '#666'
  },
  linkSpan: {
    color: '#007bff',
    cursor: 'pointer',
    textDecoration: 'underline'
  }
};

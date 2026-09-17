import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Seo } from '../../components/Seo/Seo';
import './admin-shared.css';
import './AdminLogin.css';

export const AdminLogin: React.FC = () => {
  const { session, loading, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    setSubmitting(false);
    if (signInError) {
      setError('Email o contraseña incorrectos.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="admin-page admin-login-page">
      <Seo title="Admin" noindex />
      <form className="admin-login-form" onSubmit={handleSubmit}>
        <h1 className="admin-login-title">Panel Admin (demo)</h1>
        <p className="admin-login-subtitle">Demo sin backend real: cualquier email/contraseña no vacíos funcionan.</p>
        <div>
          <label className="admin-label" htmlFor="admin-email">Email</label>
          <input
            id="admin-email"
            type="email"
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div>
          <label className="admin-label" htmlFor="admin-password">Contraseña</label>
          <input
            id="admin-password"
            type="password"
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit" className="admin-btn admin-login-submit" disabled={submitting}>
          {submitting ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
};

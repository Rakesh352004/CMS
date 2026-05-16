import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const FONT_LINK = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #07080C;
    font-family: 'Syne', sans-serif;
    color: #E8E6E0;
    position: relative;
    overflow: hidden;
  }

  /* grid texture */
  .login-root::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,212,184,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,184,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
  }

  /* glow orb top-right */
  .login-root::after {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.09) 0%, transparent 70%);
    top: -150px;
    right: -150px;
    pointer-events: none;
  }

  /* glow orb bottom-left */
  .login-glow-bl {
    position: absolute;
    width: 500px;
    height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,212,184,0.07) 0%, transparent 70%);
    bottom: -150px;
    left: -150px;
    pointer-events: none;
  }

  /* centered panel */
  .login-panel {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 440px;
    padding: 52px 48px;
    background: rgba(12,13,19,0.85);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px;
    backdrop-filter: blur(12px);
  }

  .form-eyebrow {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #00D4B8;
    margin-bottom: 12px;
    animation: fadeUp 0.5s 0.1s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .form-heading {
    font-size: 32px;
    font-weight: 800;
    line-height: 1.15;
    color: #F0EEE8;
    letter-spacing: -0.02em;
    margin-bottom: 8px;
    animation: fadeUp 0.5s 0.15s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .form-desc {
    font-size: 14px;
    color: #5A5F6E;
    line-height: 1.6;
    margin-bottom: 38px;
    font-family: 'DM Mono', monospace;
    font-weight: 300;
    animation: fadeUp 0.5s 0.2s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  /* form fields */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 28px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 7px;
    animation: fadeUp 0.5s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .field:nth-child(1) { animation-delay: 0.25s; }
  .field:nth-child(2) { animation-delay: 0.3s; }

  .field label {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #7A7F8E;
  }

  .field-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .field-icon {
    position: absolute;
    left: 14px;
    color: #3A3F4E;
    transition: color 0.2s;
    pointer-events: none;
    display: flex;
    align-items: center;
  }

  .field input {
    width: 100%;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 13px 14px 13px 44px;
    font-family: 'DM Mono', monospace;
    font-size: 14px;
    color: #E8E6E0;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }

  .field input::placeholder { color: #3A3F4E; }

  .field input:focus {
    border-color: #00D4B8;
    background: rgba(0,212,184,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,184,0.1), inset 0 0 0 1px rgba(0,212,184,0.1);
  }
  .field-wrap:focus-within .field-icon {
    color: #00D4B8;
  }

  /* show/hide password toggle */
  .pwd-toggle {
    position: absolute;
    right: 14px;
    background: none;
    border: none;
    cursor: pointer;
    color: #3A3F4E;
    display: flex;
    align-items: center;
    padding: 0;
    transition: color 0.2s;
  }
  .pwd-toggle:hover { color: #00D4B8; }

  /* error */
  .form-error {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 11px 14px;
    background: rgba(220,60,60,0.1);
    border: 1px solid rgba(220,60,60,0.2);
    border-radius: 8px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #FF6B6B;
    margin-bottom: 16px;
    animation: shake 0.4s ease;
  }

  /* submit button */
  .btn-submit {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #00D4B8 0%, #00A896 100%);
    color: #07080C;
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.03em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 20px rgba(0,212,184,0.3);
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s 0.35s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }

  .btn-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-submit:hover { opacity: 0.92; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(0,212,184,0.4); }
  .btn-submit:hover::before { opacity: 1; }
  .btn-submit:active { transform: translateY(0); }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  .btn-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  /* spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #07080C;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  /* divider */
  .form-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
    animation: fadeUp 0.5s 0.4s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .form-divider::before, .form-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.07);
  }
  .form-divider span {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: #3A3F4E;
    letter-spacing: 0.06em;
  }

  /* register link */
  .register-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    animation: fadeUp 0.5s 0.45s ease both;
    opacity: 0;
    animation-fill-mode: forwards;
  }
  .register-row span {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #5A5F6E;
  }
  .register-row a {
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: #00D4B8;
    text-decoration: none;
    font-weight: 500;
    transition: opacity 0.2s;
  }
  .register-row a:hover { opacity: 0.75; }

  /* keyframes */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-6px); }
    40%     { transform: translateX(6px); }
    60%     { transform: translateX(-4px); }
    80%     { transform: translateX(4px); }
  }

  /* responsive */
  @media (max-width: 520px) {
    .login-panel { padding: 40px 28px; margin: 0 16px; }
    .form-heading { font-size: 26px; }
  }
`;

/* SVG icons */
const IconMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="3"/>
    <path d="M2 8l10 6 10-6"/>
  </svg>
);

const IconLock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="3"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const IconEye = ({ off }) => off ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const IconAlert = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

/* component */
function Login() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      const data = await res.json();

      if (data.token) {
        localStorage.setItem('token', data.token);

        const decoded = JSON.parse(atob(data.token.split('.')[1]));
        toast.success('Login successful');

        if (decoded.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        const message = data.error || data.message || 'Invalid email or password.';
        setError(message);
        toast.error(message);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{FONT_LINK}</style>
      <style>{CSS}</style>

      <div className="login-root">
        <div className="login-glow-bl" />

        <div className="login-panel">
          <p className="form-eyebrow">// secure access</p>
          <h1 className="form-heading">Welcome<br />back.</h1>
          <p className="form-desc">Sign in to manage tickets, track complaints, and stay updated.</p>

          <form onSubmit={handleLogin} noValidate>
            <div className="field-group">

              <div className="field">
                <label htmlFor="email">Email address</label>
                <div className="field-wrap">
                  <span className="field-icon"><IconMail /></span>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="password">Password</label>
                <div className="field-wrap">
                  <span className="field-icon"><IconLock /></span>
                  <input
                    id="password"
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="pwd-toggle"
                    onClick={() => setShowPwd(!showPwd)}
                    aria-label={showPwd ? 'Hide password' : 'Show password'}
                  >
                    <IconEye off={showPwd} />
                  </button>
                </div>
              </div>

            </div>

            {error && (
              <div className="form-error" role="alert">
                <IconAlert />
                {error}
              </div>
            )}

            <button type="submit" className="btn-submit" disabled={loading}>
              <span className="btn-inner">
                {loading ? (
                  <>
                    <span className="spinner" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </span>
            </button>
          </form>

          <div className="form-divider"><span>or</span></div>

          <div className="register-row">
            <span>Don't have an account?</span>
            <Link to="/register">Create one here</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
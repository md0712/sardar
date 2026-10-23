import React, { useState } from 'react';
import { 
  X, Mail, Lock, User, Eye, EyeOff, AlertCircle, 
  CheckCircle, ArrowRight, ShieldCheck, Sparkles, Loader2 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'forgot'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register, resetPassword } = useAuth();

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrorMsg('');
    setSuccessMsg('');
    setIsSubmitting(false);
  };

  const switchMode = (newMode) => {
    setErrorMsg('');
    setSuccessMsg('');
    setMode(newMode);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const formatAuthError = (err) => {
    const code = err.code || err.message || '';
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
      return 'Invalid email or password. Please verify and try again.';
    }
    if (code.includes('email-already-in-use')) {
      return 'An account with this email address already exists. Please log in.';
    }
    if (code.includes('weak-password')) {
      return 'Password must be at least 6 characters long.';
    }
    if (code.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (code.includes('too-many-requests')) {
      return 'Access temporarily blocked due to repeated failed attempts. Please try again later or reset password.';
    }
    return err.message || 'Authentication error. Please check connection and try again.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    if (mode === 'forgot') {
      setIsSubmitting(true);
      try {
        await resetPassword(email);
        setSuccessMsg(`Password reset link sent to ${email}. Check your inbox or spam folder.`);
      } catch (err) {
        setErrorMsg(formatAuthError(err));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMsg('Please enter your full name.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        if (onSuccess) onSuccess('login');
        handleClose();
      } else if (mode === 'register') {
        await register(name, email, password);
        if (onSuccess) onSuccess('register');
        handleClose();
      }
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleClose}>
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={handleClose} aria-label="Close modal">
          <X size={20} />
        </button>

        {/* Header Branding */}
        <div className="auth-modal-header">
          <div className="auth-badge-icon" style={{ background: '#ffffff', padding: '4px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src="/logo.png" alt="Sardar Logo" style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <h3>
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p>
            {mode === 'login' && 'Sign in to access your orders, wishlist, and exclusive member discounts'}
            {mode === 'register' && (
              <>Join <strong>Sardar Mart</strong> Furniture and Home Appliances for faster checkout, live tracking, and member pricing</>
            )}
            {mode === 'forgot' && 'Enter your registered email address to receive password reset instructions'}
          </p>
        </div>

        {/* Tab Switcher */}
        {mode !== 'forgot' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              type="button"
              className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => switchMode('register')}
            >
              Register
            </button>
          </div>
        )}

        {/* Alert Messages */}
        {errorMsg && (
          <div className="auth-alert error">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="auth-alert success">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-name">Full Name</label>
              <div className="auth-input-wrap">
                <User size={18} className="field-icon" />
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. Rajesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email">Email Address</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="field-icon" />
              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="auth-field">
              <div className="field-label-row">
                <label htmlFor="auth-password">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => switchMode('forgot')}
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="auth-input-wrap">
                <Lock size={18} className="field-icon" />
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="eye-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm-password">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} className="field-icon" />
                <input
                  id="auth-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {mode === 'login' && <>Sign In to <strong>Sardar Mart</strong> Furniture and Home Appliances</>}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="auth-modal-footer">
          {mode === 'forgot' ? (
            <button
              type="button"
              className="switch-mode-link"
              onClick={() => switchMode('login')}
            >
              ← Back to Sign In
            </button>
          ) : mode === 'login' ? (
            <p>
              New customer?{' '}
              <button
                type="button"
                className="switch-mode-link highlight"
                onClick={() => switchMode('register')}
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                className="switch-mode-link highlight"
                onClick={() => switchMode('login')}
              >
                Sign In
              </button>
            </p>
          )}

          <div className="auth-security-badge">
            <ShieldCheck size={14} />
            <span>Encrypted &amp; Secured by Firebase Authentication</span>
          </div>
        </div>
      </div>

      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(28, 17, 10, 0.65);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
          animation: authFadeIn 0.22s ease-out;
        }

        @keyframes authFadeIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }

        .auth-modal-card {
          position: relative;
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 440px;
          padding: 32px;
          box-shadow: 0 20px 40px rgba(43, 23, 14, 0.22);
          border: 1px solid #fed7aa;
        }

        .auth-modal-close {
          position: absolute;
          top: 18px;
          right: 18px;
          background: #fbf7f4;
          border: 1px solid #ebd9cc;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #785949;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .auth-modal-close:hover {
          background: #2b170e;
          color: #ffffff;
        }

        .auth-modal-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .auth-badge-icon {
          width: 44px;
          height: 44px;
          background: #fef3c7;
          color: #b45309;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        .auth-modal-header h3 {
          font-size: 1.45rem;
          font-weight: 800;
          color: #2b170e;
          margin: 0 0 6px 0;
        }
        .auth-modal-header p {
          font-size: 0.85rem;
          color: #78716c;
          margin: 0;
          line-height: 1.45;
        }

        .auth-tabs {
          display: flex;
          background: #f5ede6;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 20px;
        }
        .auth-tab-btn {
          flex: 1;
          padding: 8px 12px;
          background: none;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          color: #785949;
          cursor: pointer;
          transition: all 0.18s ease;
        }
        .auth-tab-btn.active {
          background: #ffffff;
          color: #2b170e;
          box-shadow: 0 2px 6px rgba(0,0,0,0.06);
        }

        .auth-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.84rem;
          line-height: 1.4;
          margin-bottom: 16px;
        }
        .auth-alert.error {
          background: #fef2f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }
        .auth-alert.success {
          background: #f0fdf4;
          color: #15803d;
          border: 1px solid #bbf7d0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .auth-field label {
          display: block;
          font-size: 0.82rem;
          font-weight: 700;
          color: #44403c;
          margin-bottom: 5px;
        }
        .field-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .forgot-link {
          background: none;
          border: none;
          font-size: 0.78rem;
          color: #b45309;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }

        .auth-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }
        .auth-input-wrap .field-icon {
          position: absolute;
          left: 12px;
          color: #a8a29e;
          pointer-events: none;
        }
        .auth-input-wrap input {
          width: 100%;
          padding: 10px 38px 10px 38px;
          border: 1.5px solid #e7d8ce;
          border-radius: 10px;
          font-size: 0.92rem;
          color: #292524;
          outline: none;
          transition: border-color 0.18s ease;
          background: #ffffff;
        }
        .auth-input-wrap input:focus {
          border-color: #b45309;
          box-shadow: 0 0 0 3px rgba(180, 83, 9, 0.12);
        }
        .eye-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: #a8a29e;
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 0;
        }
        .eye-toggle:hover {
          color: #292524;
        }

        .auth-submit-btn {
          margin-top: 6px;
          background: linear-gradient(135deg, #2b170e 0%, #4a2818 100%);
          color: #ffffff;
          border: none;
          padding: 12px 18px;
          border-radius: 10px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(43, 23, 14, 0.25);
        }
        .auth-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(43, 23, 14, 0.35);
        }
        .auth-submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .auth-modal-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 0.85rem;
          color: #78716c;
        }
        .switch-mode-link {
          background: none;
          border: none;
          font-weight: 700;
          color: #785949;
          cursor: pointer;
          padding: 0;
        }
        .switch-mode-link.highlight {
          color: #b45309;
        }
        .switch-mode-link:hover {
          text-decoration: underline;
        }

        .auth-security-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.74rem;
          color: #a8a29e;
          margin-top: 14px;
        }
      `}</style>
    </div>
  );
}

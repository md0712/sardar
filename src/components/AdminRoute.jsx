import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminRoute({ children, fallback }) {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: '#634832'
      }}>
        <Loader2 size={36} className="animate-spin" style={{ color: '#d97706' }} />
        <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>Verifying Administrator Privileges...</p>
      </div>
    );
  }

  if (!currentUser || !isAdmin) {
    if (fallback) return fallback;
    return (
      <div style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '36px',
          maxWidth: '460px',
          textAlign: 'center',
          boxShadow: '0 10px 30px rgba(42, 24, 16, 0.12)',
          border: '1px solid #fed7aa'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#fef2f2',
            color: '#dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <ShieldAlert size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1c1917', marginBottom: '8px' }}>
            Access Restricted
          </h2>
          <p style={{ color: '#78716c', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
            This portal is restricted to authorized store administrators. Your account does not possess the verified administrative privileges.
          </p>
          <a
            href="/"
            style={{
              display: 'inline-block',
              background: '#2b170e',
              color: '#ffffff',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 700,
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}
          >
            Return to Storefront
          </a>
        </div>
      </div>
    );
  }

  return children;
}

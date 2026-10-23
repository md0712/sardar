import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function ProtectedRoute({ children, onRequireLogin }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '40vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: '#785949'
      }}>
        <Loader2 size={28} className="animate-spin" />
        <span>Authenticating session...</span>
      </div>
    );
  }

  if (!currentUser) {
    if (onRequireLogin) {
      onRequireLogin();
      return null;
    }
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <p>Please log in to view this section.</p>
      </div>
    );
  }

  return children;
}

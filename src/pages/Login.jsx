import { useKeycloak } from '../context/KeycloakContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { keycloak, authenticated } = useKeycloak();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  // ✅ Auto redirect jika sudah authenticated
  useEffect(() => {
    if (authenticated) {
      console.log('✅ Already authenticated, redirecting to profile...');
      navigate('/profile', { replace: true });
    }
  }, [authenticated, navigate]);

  const login = async () => {
    if (isLoggingIn) return;

    console.log('🔐 Initiating login...');

    try {
      setIsLoggingIn(true);

      // ✅ Gunakan redirectUri yang benar
      const redirectUri = `${window.location.origin}/profile`;
      console.log('Redirect URI:', redirectUri);

      keycloak.login({
        redirectUri: redirectUri,
        prompt: 'login',
      });
    } catch (error) {
      console.error('❌ Login failed:', error);
      setIsLoggingIn(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      <h2>Welcome to SSO App</h2>
      <p>Status: {authenticated ? 'Logged In ✅' : 'Not Logged In ❌'}</p>

      {!authenticated && (
        <button
          onClick={login}
          disabled={isLoggingIn}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: isLoggingIn ? 'not-allowed' : 'pointer',
            opacity: isLoggingIn ? 0.6 : 1,
          }}
        >
          {isLoggingIn ? 'Redirecting...' : 'Login with Keycloak'}
        </button>
      )}
    </div>
  );
}

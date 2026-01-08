import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/api';
import { useKeycloak } from '../context/KeycloakContext';

function Profile() {
  const { keycloak, authenticated } = useKeycloak();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!authenticated) {
        keycloak.login({ redirectUri: window.location.origin + '/profile' });
        return;
      }

      try {
        setLoading(true);
        const userData = await getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        console.error('Fetch user error:', err);
        setError(err.response?.data?.detail || 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [authenticated, keycloak]);

  const handleLogout = () => {
    keycloak.logout({
      redirectUri: window.location.origin,
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <h2>Error: {error}</h2>
        <button onClick={handleLogout}>Back to Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>User Profile</h1>
      {user && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Full Name:</strong> {user.full_name || 'N/A'}</p>
          <p><strong>Bio:</strong> {user.bio || 'N/A'}</p>
          {user.avatar_url && (
            <img
              src={user.avatar_url}
              alt="Avatar"
              style={{ width: '100px', height: '100px', borderRadius: '50%' }}
            />
          )}
          <br />
          <button onClick={handleLogout} style={{ marginTop: '20px' }}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default Profile;

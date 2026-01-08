import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useKeycloak } from './context/KeycloakContext';
import Login from './pages/Login';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const { authenticated } = useKeycloak();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={authenticated ? <Navigate to="/profile" replace /> : <Login />}
        />
        <Route
          path="/profile"
          element={authenticated ? <Profile /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

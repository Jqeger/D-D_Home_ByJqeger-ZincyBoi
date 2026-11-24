import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useState, useEffect } from 'react';
import './index.css';
import LoginPage from './LoginPage';
import Dashboard from './Dashboard';
import DicePage from './DicePage';
import CharacterSheet from './CharacterSheet';
import './firebase-config';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/dice"
          element={user ? <DicePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/character-sheet"
          element={user ? <CharacterSheet /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={<Navigate to={user ? '/dashboard' : '/login'} />}
        />
      </Routes>
    </Router>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
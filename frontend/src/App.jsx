import React, { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CharactersList from './pages/CharactersList'
import CharacterDetail from './pages/CharacterDetail'
import CharacterForm from './pages/CharacterForm'
import PartySelection from './pages/PartySelection'
import AdventureSheet from './pages/AdventureSheet'
import LoginPage from './pages/LoginPage'
import { getCurrentUser, logout } from './api/auth'

function PrivateRoute({ children, user }) {
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const [user, setUser] = useState(getCurrentUser());
  const location = useLocation();

  useEffect(() => {
    setUser(getCurrentUser());
  }, [location]);

  const handleLogout = () => {
    logout();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="app">
      <header className="topbar">
        <Link to="/" className="brand">4AD: DIGITAL CHARACTER SHEET</Link>
        <nav>
          {user ? (
            <>
              <Link to="/" className="btn small">Home</Link>
              <Link to="/list" className="btn small" style={{marginLeft: '10px'}}>Vault</Link>
              <Link to="/party" className="btn small" style={{marginLeft: '10px'}}>Party</Link>
              <Link to="/new" className="btn small" style={{marginLeft: '10px'}}>Forge</Link>
              <button onClick={handleLogout} className="btn small danger" style={{marginLeft: '10px'}}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn small">Login</Link>
          )}
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={() => setUser(getCurrentUser())} />} />
          <Route path="/" element={<PrivateRoute user={user}><LandingPage /></PrivateRoute>} />
          <Route path="/list" element={<PrivateRoute user={user}><CharactersList /></PrivateRoute>} />
          <Route path="/party" element={<PrivateRoute user={user}><PartySelection /></PrivateRoute>} />
          <Route path="/characters/:id" element={<PrivateRoute user={user}><CharacterDetail /></PrivateRoute>} />
          <Route path="/new" element={<PrivateRoute user={user}><CharacterForm /></PrivateRoute>} />
          <Route path="/edit/:id" element={<PrivateRoute user={user}><CharacterForm /></PrivateRoute>} />
          <Route path="/adventure" element={<PrivateRoute user={user}><AdventureSheet /></PrivateRoute>} />
        </Routes>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} — Four Against Darkness: Expanded Edition Digital Assistant
      </footer>
    </div>
  )
}

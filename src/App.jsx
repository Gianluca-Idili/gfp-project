import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App" style={{ maxWidth: 1400, margin: '0 auto', padding: 20, fontFamily: 'system-ui, sans-serif' }}>
        <nav className="main-nav">
          <div className="nav-container">
            <Link to="/" className="nav-logo">
              🏠 RealEstate
            </Link>
            <div className="nav-links">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/create" className="nav-link create-link">
                ➕ Aggiungi Proprietà
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>

        <footer className="app-footer">
          <p>Real Estate Platform - Made with React & Supabase</p>
          <p className="footer-note">
            Questo è un progetto dimostrativo. I dati sono di esempio.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
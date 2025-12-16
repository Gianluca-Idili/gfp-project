import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import CreatePage from './pages/CreatePage';
import EditPage from './pages/EditPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import PropertiesPage from './pages/PropertiesPage';
import './App.css';

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <header className="header" id="header">
        <div className="container">
          <div className="header__content">
            <Link to="/" className="header__logo">🏠 GFP</Link>
            <nav className="header__nav" id="mainNav">
              <ul className="nav__list">
                <li><Link to="/" className="nav__link">Home</Link></li>
                <li><Link to="/#immobili" className="nav__link">Immobili</Link></li>
                <li><Link to="/#servizi" className="nav__link">Servizi</Link></li>
                <li><Link to="/#chi-siamo" className="nav__link">Chi Siamo</Link></li>
              </ul>
            </nav>
            <div className="header__actions">
              <Link to="/admin" className="btn-primary">📊 Admin</Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/create" element={<CreatePage />} />
          <Route path="/edit/:id" element={<EditPage />} />
        </Routes>
      </main>

      {!isAdmin && (
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-col footer-col-main">
                <h3 className="footer-title">GIEFFE PATRIMONI<br/>REAL ESTATE ADVISOR</h3>
                <p className="footer-description">Torino, Londra, Alba, Milano, Roma, Monza</p>
                <div className="social-links">
                  <a href="#" aria-label="Facebook">f</a>
                  <a href="#" aria-label="Instagram">📷</a>
                  <a href="#" aria-label="LinkedIn">in</a>
                </div>
              </div>

              <div className="footer-col footer-col-links">
                <div className="footer-links-grid">
                  <div className="footer-accordion-item">
                    <h4 className="footer-subtitle">Immobili</h4>
                    <ul className="footer-links footer-accordion-content">
                      <li><Link to="/">In vendita</Link></li>
                      <li><Link to="/">In affitto</Link></li>
                      <li><Link to="/">Con piscina</Link></li>
                    </ul>
                  </div>
                  <div className="footer-accordion-item">
                    <h4 className="footer-subtitle">Azienda</h4>
                    <ul className="footer-links footer-accordion-content">
                      <li><Link to="/">Chi siamo</Link></li>
                      <li><Link to="/">Contatti</Link></li>
                      <li><Link to="/">Privacy</Link></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="footer-col footer-col-newsletter">
                <h4 className="footer-subtitle">Newsletter</h4>
                <form className="newsletter-form">
                  <input type="email" placeholder="Email" required />
                  <button type="submit" className="btn-primary">📧</button>
                </form>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; Copyright 2024 - GIEFFE PATRIMONI - Tutti i diritti riservati</p>
            </div>
          </div>
        </footer>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
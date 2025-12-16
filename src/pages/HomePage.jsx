import React from 'react'
import { Link } from 'react-router-dom'
import PropertyList from '../components/PropertyList'

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero__background">
          <img src="/fileEsempio/images/header homepage.png" alt="Gieffe Patrimoni" className="hero__image" />
          <div className="hero__overlay"></div>
        </div>
        <div className="container">
          <div className="hero__content">
            <h1 className="hero__title">
              <span className="title__line">Eccellenza</span>
              <span className="title__line">Immobiliare</span>
            </h1>
            <p className="hero__subtitle">Real Estate Advisor dal 1995</p>
            <div className="hero__stats">
              <div className="stat">
                <span className="stat__number">500+</span>
                <span className="stat__label">Immobili</span>
              </div>
              <div className="stat">
                <span className="stat__number">6</span>
                <span className="stat__label">Sedi</span>
              </div>
              <div className="stat">
                <span className="stat__number">25+</span>
                <span className="stat__label">Anni</span>
              </div>
            </div>
          </div>
        </div>
        <button className="hero__scroll" aria-label="Scorri" onClick={() => document.getElementById('searchSection').scrollIntoView({behavior: 'smooth'})}>
          ▼
        </button>
      </section>

      {/* Featured Categories */}
      <section className="featured-categories">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Scopri per Categoria</h2>
          </div>
          
          <div className="categories-wrapper">
            <div className="categories-grid" id="categoriesGrid">
              <Link to="#" className="category-card" data-category="piscina">
                <div className="category-card__image">
                  <img src="/fileEsempio/images/piscina.avif" alt="Immobili con piscina" />
                  <div className="category-card__overlay"></div>
                </div>
                <div className="category-card__content">
                  <h3 className="category-card__title">Immobili con piscina</h3>
                  <span className="category-card__arrow">→</span>
                </div>
              </Link>
              
              <Link to="#" className="category-card" data-category="uffici">
                <div className="category-card__image">
                  <img src="/fileEsempio/images/uffici.avif" alt="Uffici e negozi" />
                  <div className="category-card__overlay"></div>
                </div>
                <div className="category-card__content">
                  <h3 className="category-card__title">Uffici e negozi</h3>
                  <span className="category-card__arrow">→</span>
                </div>
              </Link>
              
              <Link to="#" className="category-card" data-category="giardino">
                <div className="category-card__image">
                  <img src="/fileEsempio/images/giardino.jpg" alt="Immobili con Giardino" />
                  <div className="category-card__overlay"></div>
                </div>
                <div className="category-card__content">
                  <h3 className="category-card__title">Immobili con Giardino</h3>
                  <span className="category-card__arrow">→</span>
                </div>
              </Link>
              
              <Link to="#" className="category-card" data-category="terrazzo">
                <div className="category-card__image">
                  <img src="/fileEsempio/images/terrazzo.jpg" alt="Immobili con Terrazzo" />
                  <div className="category-card__overlay"></div>
                </div>
                <div className="category-card__content">
                  <h3 className="category-card__title">Immobili con Terrazzo</h3>
                  <span className="category-card__arrow">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="search-section" id="searchSection">
        <div className="container">
          <div className="search-bar">
            <div className="search-bar__tabs">
              <button className="tab active" data-type="residenziale">Residenziale</button>
              <button className="tab" data-type="commerciale">Commerciale</button>
            </div>
            <div className="search-bar__form">
              <div className="search-input">
                <span>📍</span>
                <input type="text" placeholder="Città, indirizzo, zona..." />
              </div>
              <div className="search-select">
                <select>
                  <option value="">Tipo</option>
                  <option value="appartamento">Appartamento</option>
                  <option value="villa">Villa</option>
                  <option value="attico">Attico</option>
                  <option value="loft">Loft</option>
                </select>
              </div>
              <div className="search-select">
                <select>
                  <option value="">Contratto</option>
                  <option value="vendita">Vendita</option>
                  <option value="affitto">Affitto</option>
                </select>
              </div>
              <button className="btn-primary">
                <span>Cerca</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="properties" id="immobili">
        <div className="container">
          <div className="section-header centered">
            <div className="section-header__content">
              <span className="section-label">In Evidenza</span>
              <h2 className="section-title">Immobili Selezionati</h2>
            </div>
            <div className="section-header__actions">
              <div className="filter-chips">
                <button className="chip active" data-filter="all">Tutti</button>
                <button className="chip" data-filter="vendita">Vendita</button>
                <button className="chip" data-filter="affitto">Affitto</button>
                <button className="chip" data-filter="luxury">Luxury</button>
              </div>
              <div className="view-toggle">
                <button className="view-btn active" data-view="grid">⊞</button>
                <button className="view-btn" data-view="list">☰</button>
              </div>
            </div>
          </div>

          <PropertyList />

          <div className="section-footer">
            <Link to="/properties" className="btn-secondary">
              <span>Vedi Tutti gli Immobili</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services" id="servizi">
        <div className="container">
          <div className="section-header centered">
            <span className="section-label">I Nostri Servizi</span>
            <p className="services-intro">Per noi, creare valore significa fornire servizi di alta qualità nella consulenza immobiliare e di intermediazione.</p>
          </div>

          <div className="services-grid-large">
            <div className="service-card-large">
              <div className="service-card-large__image">
                <img src="/fileEsempio/images/residenziale.webp" alt="Servizi Residenziali" />
                <div className="service-card-large__overlay"></div>
              </div>
              <div className="service-card-large__content">
                <div className="service-card-large__icon">🏠</div>
                <h3 className="service-card-large__title">Residenziale</h3>
                <p className="service-card-large__intro">Gieffe Patrimoni offre ai Clienti servizi strutturati di consulenza e assistenza operativa nell'acquisto, vendita e locazione di immobili residenziali.</p>
                
                <ul className="service-card-large__features">
                  <li><span>✓</span> <span>Analisi delle necessità del cliente</span></li>
                  <li><span>✓</span> <span>Analisi delle tipologie abitative</span></li>
                  <li><span>✓</span> <span>Concretizzazione dei mandati di vendita in tempi ridotti</span></li>
                  <li><span>✓</span> <span>Allineamento delle proposte di acquisto al mercato</span></li>
                  <li><span>✓</span> <span>Consulenza post-vendita</span></li>
                </ul>
                
                <button className="btn-primary">
                  <span>Scopri il servizio</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className="service-card-large">
              <div className="service-card-large__image">
                <img src="/fileEsempio/images/investimenti immobiliari.jpg" alt="Investimenti Immobiliari" />
                <div className="service-card-large__overlay"></div>
              </div>
              <div className="service-card-large__content">
                <div className="service-card-large__icon">📈</div>
                <h3 className="service-card-large__title">Investimenti immobiliari</h3>
                <p className="service-card-large__intro">Gieffe Patrimoni segue e accompagna il Cliente che intende operare nel campo degli investimenti immobiliari, e gestisce il reddito di tale sviluppo, attraverso l'esperienza di professionisti altamente qualificati.</p>
                
                <ul className="service-card-large__features">
                  <li><span>✓</span> <span>Conoscenza specifica del mercato immobiliare retail</span></li>
                  <li><span>✓</span> <span>Studi di fattibilità e analisi di mercato</span></li>
                  <li><span>✓</span> <span>Consulenza in materia urbanistica</span></li>
                  <li><span>✓</span> <span>Analisi capillare del territorio e del mercato di riferimento</span></li>
                  <li><span>✓</span> <span>Rapporti con i principali istituti di credito</span></li>
                  <li><span>✓</span> <span>Gestione patrimoniale</span></li>
                </ul>
                
                <button className="btn-primary">
                  <span>Scopri il servizio</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact */}
      <section className="about-contact-combined" id="chi-siamo">
        <div className="about-contact-background">
          <img src="/fileEsempio/images/chi siamo.jpg" alt="Gieffe Patrimoni" />
          <div className="about-contact-overlay"></div>
        </div>
        <div className="container">
          <div className="about-contact-content">
            <div className="about-contact-info">
              <span className="section-label">Chi Siamo</span>
              <h2 className="section-title">Gieffe Patrimoni Real Estate Advisor</h2>
              <p className="about-description">
                Gieffe Patrimoni RealEstateAdvisor è uno studio immobiliare che progetta strategie e metodi finalizzati alla creazione di valore.
                Gieffe Patrimoni ha sede primaria a Torino ed ha uffici a Londra, Milano, Alba, Roma e Monza.
              </p>
              
              <div className="contact-details">
                <h3 className="contact-subtitle">Sede centrale - Torino</h3>
                <div className="contact-item">
                  <span>📍</span>
                  <div>
                    <strong>Indirizzo</strong>
                    <p>Via della Rocca 19</p>
                    <p>10123 - IT</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span>☎️</span>
                  <div>
                    <strong>Telefono</strong>
                    <p>+39 011 76 00 011</p>
                  </div>
                </div>
                <div className="contact-item">
                  <span>✉️</span>
                  <div>
                    <strong>Email</strong>
                    <p>info@gieffepatrimoni.com</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form" id="contactForm">
              <span className="section-label">Contatti</span>
              <div className="form-group full-width">
                <input type="text" placeholder="Nome e Cognome" required />
              </div>
              <div className="form-group full-width">
                <input type="email" placeholder="Email" required />
              </div>
              <div className="form-group full-width">
                <input type="tel" placeholder="Telefono" required />
              </div>
              <div className="form-group full-width">
                <input type="text" placeholder="Indirizzo" />
              </div>
              <div className="form-group full-width">
                <textarea placeholder="Messaggio" rows="4" required></textarea>
              </div>
              <div className="form-group full-width">
                <label className="checkbox-label">
                  <input type="checkbox" required />
                  <span>Ho letto l'informativa sulla privacy.</span>
                </label>
              </div>
              <button type="submit" className="btn-primary" style={{width: '100%'}}>
                <span>Invia Richiesta</span>
                <span>→</span>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}
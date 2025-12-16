import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    priceMin: '',
    priceMax: '',
    roomsMin: '',
    roomsMax: '',
    sqMin: '',
    sqMax: '',
    services: [],
    type: 'all'
  })

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
        setProperties(data ?? [])
        setFiltered(data ?? [])
      } catch (e) {
        console.error('Errore:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let result = properties

    if (filters.search) {
      result = result.filter(p => 
        p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.address?.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    if (filters.priceMin) {
      result = result.filter(p => p.price >= Number(filters.priceMin))
    }
    if (filters.priceMax) {
      result = result.filter(p => p.price <= Number(filters.priceMax))
    }

    if (filters.roomsMin) {
      result = result.filter(p => p.rooms >= Number(filters.roomsMin))
    }
    if (filters.roomsMax) {
      result = result.filter(p => p.rooms <= Number(filters.roomsMax))
    }

    if (filters.sqMin) {
      result = result.filter(p => p.square_meters >= Number(filters.sqMin))
    }
    if (filters.sqMax) {
      result = result.filter(p => p.square_meters <= Number(filters.sqMax))
    }

    if (filters.type !== 'all') {
      result = result.filter(p => p.type === filters.type)
    }

    if (filters.services.length > 0) {
      result = result.filter(p => {
        if (!p.services) return false
        return filters.services.some(s => p.services.toLowerCase().includes(s.toLowerCase()))
      })
    }

    setFiltered(result)
  }, [filters, properties])

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (service) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const resetFilters = () => {
    setFilters({
      search: '',
      priceMin: '',
      priceMax: '',
      roomsMin: '',
      roomsMax: '',
      sqMin: '',
      sqMax: '',
      services: [],
      type: 'all'
    })
  }

  const allServices = [...new Set(properties.flatMap(p => p.services?.split(',').map(s => s.trim()) || []))]

  return (
    <div style={{ marginTop: '60px', minHeight: '100vh', background: '#f5f5f5', padding: '2rem 0' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', margin: '0 0 1rem', fontFamily: "'Cormorant Garamond', serif" }}>
            Tutte le Proprietà
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', margin: '0' }}>
            Trova la proprietà perfetta con i nostri filtri avanzati
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>
          
          {/* Sidebar Filters */}
          <aside style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', position: 'sticky', top: '80px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1a1a1a', margin: '0', fontWeight: '600' }}>Filtri</h3>
              <button 
                onClick={resetFilters}
                style={{ background: 'none', border: 'none', color: '#d4af37', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem' }}
              >
                Reimposta
              </button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                Cerca
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Titolo, indirizzo..."
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            {/* Type */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                style={{ width: '100%', padding: '0.6rem', border: '1px solid #ddd', borderRadius: '4px' }}
              >
                <option value="all">Tutti</option>
                <option value="vendita">Vendita</option>
                <option value="affitto">Affitto</option>
              </select>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                Prezzo
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={filters.priceMin}
                  onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                  placeholder="Min"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
                <input
                  type="number"
                  value={filters.priceMax}
                  onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                  placeholder="Max"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Rooms */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                Stanze
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={filters.roomsMin}
                  onChange={(e) => handleFilterChange('roomsMin', e.target.value)}
                  placeholder="Min"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
                <input
                  type="number"
                  value={filters.roomsMax}
                  onChange={(e) => handleFilterChange('roomsMax', e.target.value)}
                  placeholder="Max"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Square Meters */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                Metri Quadri
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <input
                  type="number"
                  value={filters.sqMin}
                  onChange={(e) => handleFilterChange('sqMin', e.target.value)}
                  placeholder="Min"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
                <input
                  type="number"
                  value={filters.sqMax}
                  onChange={(e) => handleFilterChange('sqMax', e.target.value)}
                  placeholder="Max"
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', fontSize: '0.85rem', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Services */}
            {allServices.length > 0 && (
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#333' }}>
                  Servizi
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {allServices.map(service => (
                    <label key={service} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <input
                        type="checkbox"
                        checked={filters.services.includes(service)}
                        onChange={() => toggleService(service)}
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Results */}
          <main>
            <div style={{ marginBottom: '1.5rem', color: '#666', fontSize: '0.95rem' }}>
              <strong>{filtered.length}</strong> proprietà trovate
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>Caricamento...</div>
            ) : filtered.length === 0 ? (
              <div style={{ background: 'white', padding: '2rem', textAlign: 'center', borderRadius: '8px' }}>
                <p style={{ color: '#999' }}>Nessuna proprietà corrisponde ai tuoi filtri</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {filtered.map(property => (
                  <Link 
                    key={property.id}
                    to={`/property/${property.id}`}
                    className="property-card"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="property-card__image">
                      {property.image_url && (
                        <img src={property.image_url} alt={property.title} loading="lazy" />
                      )}
                      <span className="property-card__badge">{property.type}</span>
                    </div>
                    <div className="property-card__content">
                      <div className="property-card__price">€{property.price?.toLocaleString('it-IT')}</div>
                      <h3 className="property-card__title">{property.title}</h3>
                      {property.address && (
                        <div className="property-card__address">📍 {property.address}</div>
                      )}
                      <div className="property-card__features">
                        {property.rooms && <div className="feature"><span>🛏️</span><span>{property.rooms}</span></div>}
                        {property.bathrooms && <div className="feature"><span>🚿</span><span>{property.bathrooms}</span></div>}
                        {property.square_meters && <div className="feature"><span>📐</span><span>{property.square_meters} m²</span></div>}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
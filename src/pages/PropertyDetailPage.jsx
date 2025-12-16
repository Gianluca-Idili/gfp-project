import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error: err } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (err) throw new Error(err.message)
        setProperty(data)
        setLoading(false)
      } catch (e) {
        setError(String(e))
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', marginTop: '100px' }}>Caricamento...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red', marginTop: '100px' }}>Errore: {error}</div>
  if (!property) return <div style={{ padding: '2rem', marginTop: '100px' }}>Proprietà non trovata</div>

  return (
    <div style={{ marginTop: '60px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        
        {/* Back Button */}
        <Link to="/" style={{ color: '#d4af37', textDecoration: 'none', fontWeight: '600', marginBottom: '2rem', display: 'inline-block' }}>
          ← Torna alla Home
        </Link>

        {/* Main Content */}
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          
          {/* Gallery */}
          <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
            <img src={property.image_url} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Content */}
          <div style={{ padding: '2rem' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '2rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '1.5rem' }}>
              <span style={{ background: '#d4af37', color: '#1a1a1a', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
                {property.type === 'vendita' ? '🏷️ Vendita' : '🔑 Affitto'}
              </span>
              <h1 style={{ fontSize: '2.5rem', color: '#1a1a1a', margin: '1rem 0 0.5rem', fontFamily: "'Cormorant Garamond', serif", fontWeight: '600' }}>
                {property.title}
              </h1>
              {property.address && (
                <p style={{ fontSize: '1.1rem', color: '#666', margin: '0' }}>
                  📍 {property.address}
                </p>
              )}
            </div>

            {/* Price Section */}
            <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.9rem', color: '#999', marginBottom: '0.5rem' }}>Prezzo</div>
              <div style={{ fontSize: '2rem', color: '#d4af37', fontWeight: '700' }}>
                €{property.price?.toLocaleString('it-IT')}
              </div>
            </div>

            {/* Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
              {property.rooms && (
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>Stanze</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a' }}>{property.rooms}</div>
                </div>
              )}
              {property.square_meters && (
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>Superficie</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a' }}>{property.square_meters} m²</div>
                </div>
              )}
              {property.bathrooms && (
                <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.85rem', color: '#999', marginBottom: '0.5rem' }}>Bagni</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1a1a1a' }}>{property.bathrooms}</div>
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: '#1a1a1a', marginBottom: '1rem', fontWeight: '600' }}>Descrizione</h2>
                <p style={{ color: '#666', lineHeight: '1.8', fontSize: '1rem' }}>
                  {property.description}
                </p>
              </div>
            )}

            {/* Services */}
            {property.services && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: '#1a1a1a', marginBottom: '1rem', fontWeight: '600' }}>Servizi e Caratteristiche</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {property.services.split(',').map((service, i) => (
                    <span key={i} style={{ background: '#e0e7ff', color: '#3730a3', padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.9rem' }}>
                      ✓ {service.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Info Box */}
            <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', color: '#1a1a1a', marginBottom: '1rem', fontWeight: '600' }}>Informazioni Proprietà</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.95rem' }}>
                <div>
                  <div style={{ color: '#999', marginBottom: '0.3rem' }}>Tipo</div>
                  <div style={{ color: '#1a1a1a', fontWeight: '600' }}>{property.type === 'vendita' ? 'Vendita' : 'Affitto'}</div>
                </div>
                <div>
                  <div style={{ color: '#999', marginBottom: '0.3rem' }}>Pubblicato</div>
                  <div style={{ color: '#1a1a1a', fontWeight: '600' }}>{new Date(property.created_at).toLocaleDateString('it-IT')}</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button style={{ background: '#1a1a1a', color: 'white', border: 'none', padding: '1rem 2rem', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                📞 Richiedi Informazioni
              </button>
              <Link to="/" style={{ background: 'transparent', color: '#1a1a1a', border: '2px solid #1a1a1a', padding: '1rem 2rem', borderRadius: '4px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', textDecoration: 'none', textAlign: 'center' }}>
                ← Torna indietro
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
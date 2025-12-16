import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function AdminProperties({ onSelectProperty }) {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
        setProperties([])
      } else {
        setProperties(data ?? [])
        setError(null)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questa proprietà?')) return

    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        alert(`Errore: ${error.message}`)
      } else {
        setProperties(prev => prev.filter(p => p.id !== id))
        alert('Proprietà eliminata con successo')
      }
    } catch (e) {
      alert(`Errore: ${String(e)}`)
    }
  }

  console.log('AdminProperties:', { loading, error, propertiesCount: properties.length })

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Caricamento...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Errore: {error}</div>
  if (!properties.length) return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Nessuna proprietà trovata</div>

  return (
    <div className="admin-properties">
      <div className="properties-table-wrapper">
        <table className="properties-table">
          <thead>
            <tr>
              <th>Immagine</th>
              <th>Titolo</th>
              <th>Indirizzo</th>
              <th>Prezzo</th>
              <th>Stanze</th>
              <th>Mq</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {properties.map(property => (
              <tr key={property.id}>
                <td className="img-cell">
                  {property.image_url && (
                    <img src={property.image_url} alt={property.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  )}
                </td>
                <td><strong>{property.title}</strong></td>
                <td>{property.address || '-'}</td>
                <td className="price">€{property.price?.toLocaleString()}</td>
                <td>{property.rooms}</td>
                <td>{property.square_meters} m²</td>
                <td className="actions-cell">
                  <button 
                    className="btn-edit"
                    onClick={() => onSelectProperty(property.id)}
                    title="Modifica"
                  >
                    ✏️
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(property.id)}
                    title="Elimina"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
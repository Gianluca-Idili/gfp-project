import React from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const PropertyCard = ({ property, onDelete }) => {
  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questa proprietà?')) {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', property.id);

      if (error) {
        alert(`Errore: ${error.message}`);
      } else {
        if (onDelete) onDelete(property.id);
      }
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
      {/* Pulsanti edit/delete */}
      <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 8, zIndex: 10 }}>
        <Link 
          to={`/edit/${property.id}`}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            width: 36,
            height: 36,
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            textDecoration: 'none'
          }}
          title="Modifica"
        >
          ✏️
        </Link>
        <button
          onClick={handleDelete}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            width: 36,
            height: 36,
            borderRadius: 4,
            cursor: 'pointer',
            fontSize: 18
          }}
          title="Elimina"
        >
          🗑️
        </button>
      </div>

      {property.image_url && (
        <img 
          src={property.image_url} 
          alt={property.title}
          style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 8, borderRadius: 4 }}
        />
      )}
      <h3 style={{ margin: '0 0 6px 0', fontSize: 18, paddingRight: 80 }}>{property.title}</h3>
      {property.description ? <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>{property.description}</p> : null}
      {property.address ? <p style={{ margin: '0 0 6px 0', fontSize: 14, color: '#666' }}>📍 {property.address}</p> : null}
      
      <div style={{ marginBottom: 8, fontSize: 14 }}>
        <div><strong>Prezzo:</strong> €{property.price}</div>
        <div><strong>Stanze:</strong> {property.rooms}</div>
        <div><strong>Mq:</strong> {property.square_meters} m²</div>
      </div>

      {property.services ? <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#555' }}><strong>Servizi:</strong> {property.services}</p> : null}
      
      {property.created_at ? <small style={{ color: '#999' }}>{new Date(property.created_at).toLocaleDateString('it-IT')}</small> : null}
    </div>
  );
};

export default PropertyCard;
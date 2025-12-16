import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

export default function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let channel = null;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (fetchError) {
          setError(fetchError.message);
          setProperties([]);
        } else {
          setProperties(data ?? []);
          setError(null);
        }
      } catch (e) {
        setError(String(e));
      } finally {
        setLoading(false);
      }
    };

    load();

    try {
      channel = supabase
        .channel('public:properties')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'properties' },
          (payload) => {
            const evt = payload.eventType;
            const row = payload.new ?? payload.old;
            if (!row) return;
            if (evt === 'INSERT') {
              setProperties((prev) => {
                if (prev.some((p) => p.id === row.id)) return prev;
                return [row, ...prev];
              });
            } else if (evt === 'UPDATE') {
              setProperties((prev) => prev.map((p) => (p.id === row.id ? row : p)));
            } else if (evt === 'DELETE') {
              setProperties((prev) => prev.filter((p) => p.id !== row.id));
            }
          }
        )
        .subscribe();
    } catch (e) {
      console.warn('Realtime subscription failed', e);
    }

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Caricamento...</div>;
  if (error) return <div style={{ color: 'red' }}>Errore: {error}</div>;
  if (!properties.length) return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>Nessuna proprietà disponibile</div>;

  return (
    <div className="properties-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
      {properties.map((property) => (
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
  );
}
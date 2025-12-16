import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import PropertyCard from './PropertyCard';

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
          .order('created_at', { ascending: false });

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

  if (loading) return <div>Caricamento...</div>;
  if (error) return <div style={{ color: 'red' }}>Errore: {error}</div>;
  if (!properties.length) return <div>Nessuna proprietà</div>;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
      {properties.map((p) => (
        <PropertyCard 
          key={p.id} 
          property={p}
          onDelete={(id) => setProperties(prev => prev.filter(prop => prop.id !== id))}
        />
      ))}
    </div>
  );
}
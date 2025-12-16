import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

export default function CreateProperty({ onSuccess }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [address, setAddress] = useState('');
  const [rooms, setRooms] = useState('');
  const [squareMeters, setSquareMeters] = useState('');
  const [services, setServices] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, onSuccess]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim()) {
      setError('Titolo obbligatorio');
      return;
    }

    if (!price || price === '') {
      setError('Prezzo obbligatorio');
      return;
    }

    if (!rooms || rooms === '') {
      setError('Numero stanze obbligatorio');
      return;
    }

    if (!squareMeters || squareMeters === '') {
      setError('Metri quadri obbligatori');
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('properties-images')
          .upload(fileName, imageFile);

        if (uploadError) {
          setError(`Errore upload immagine: ${uploadError.message}`);
          setLoading(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from('properties-images')
          .getPublicUrl(fileName);
        imageUrl = urlData?.publicUrl;
      }

      const newRow = {
        title: title.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        price: Number(price),
        rooms: Number(rooms),
        square_meters: Number(squareMeters),
        services: services.trim() || null,
        image_url: imageUrl
      };

      const { error: insertError } = await supabase
        .from('properties')
        .insert([newRow]);

      if (insertError) {
        setError(insertError.message);
      } else {
        setSuccess('Proprietà creata con successo!');
        setTitle('');
        setDescription('');
        setPrice('');
        setAddress('');
        setRooms('');
        setSquareMeters('');
        setServices('');
        setImageFile(null);
        setImagePreview(null);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
      {error && <div style={{ color: 'red', marginBottom: 8, padding: 8, backgroundColor: '#ffe6e6', borderRadius: 4 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: 8, padding: 8, backgroundColor: '#e6ffe6', borderRadius: 4 }}>{success}</div>}

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Titolo *</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Descrizione</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Indirizzo</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Prezzo *</label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            step="0.01"
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Stanze *</label>
          <input
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            type="number"
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Metri quadri *</label>
        <input
          value={squareMeters}
          onChange={(e) => setSquareMeters(e.target.value)}
          type="number"
          required
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Servizi</label>
        <textarea
          value={services}
          onChange={(e) => setServices(e.target.value)}
          rows={2}
          placeholder="es. Wi-Fi, Parcheggio, Giardino..."
          style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4, boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 600 }}>Immagine</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: 8 }}
        />
        {imagePreview && (
          <div style={{ marginTop: 8 }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 4 }} />
          </div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 600
        }}
      >
        {loading ? 'Caricamento...' : 'Crea proprietà'}
      </button>
    </form>
  );
}
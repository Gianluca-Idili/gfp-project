import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../services/supabase'

export default function EditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [property, setProperty] = useState(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [address, setAddress] = useState('')
  const [rooms, setRooms] = useState('')
  const [squareMeters, setSquareMeters] = useState('')
  const [services, setServices] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Carica proprietà
  useEffect(() => {
    const loadProperty = async () => {
      setLoading(true)
      try {
        const { data, error: fetchError } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single()

        if (fetchError) {
          setError(`Errore: ${fetchError.message}`)
          setLoading(false)
          return
        }

        setProperty(data)
        setTitle(data.title)
        setDescription(data.description || '')
        setPrice(data.price || '')
        setAddress(data.address || '')
        setRooms(data.rooms || '')
        setSquareMeters(data.square_meters || '')
        setServices(data.services || '')
        setImagePreview(data.image_url)
        setLoading(false)
      } catch (e) {
        setError(String(e))
        setLoading(false)
      }
    }

    loadProperty()
  }, [id])

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!title.trim()) {
      setError('Titolo obbligatorio')
      return
    }

    if (!price || price === '') {
      setError('Prezzo obbligatorio')
      return
    }

    if (!rooms || rooms === '') {
      setError('Numero stanze obbligatorio')
      return
    }

    if (!squareMeters || squareMeters === '') {
      setError('Metri quadri obbligatori')
      return
    }

    setSaving(true)
    try {
      let imageUrl = property.image_url

      // Se c'è una nuova immagine, caricala
      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('properties-images')
          .upload(fileName, imageFile)

        if (uploadError) {
          setError(`Errore upload immagine: ${uploadError.message}`)
          setSaving(false)
          return
        }

        const { data: urlData } = supabase.storage
          .from('properties-images')
          .getPublicUrl(fileName)
        imageUrl = urlData?.publicUrl
      }

      const updateData = {
        title: title.trim(),
        description: description.trim() || null,
        address: address.trim() || null,
        price: Number(price),
        rooms: Number(rooms),
        square_meters: Number(squareMeters),
        services: services.trim() || null,
        image_url: imageUrl
      }

      const { error: updateError } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)

      if (updateError) {
        setError(updateError.message)
      } else {
        setSuccess('Proprietà aggiornata con successo!')
        setTimeout(() => {
          navigate('/')
        }, 1500)
      }
    } catch (e) {
      setError(String(e))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 20 }}>Caricamento...</div>
  if (error && !property) return <div style={{ color: 'red', textAlign: 'center', padding: 20 }}>Errore: {error}</div>

  return (
    <div style={{ maxWidth: 1200 }}>
      <h1>Modifica proprietà</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 40 }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
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
          </div>

          <button 
            type="submit" 
            disabled={saving}
            style={{
              padding: '10px 20px',
              backgroundColor: saving ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontWeight: 600
            }}
          >
            {saving ? 'Salvataggio...' : 'Salva modifiche'}
          </button>
        </form>

        {/* Anteprima */}
        <div style={{ position: 'sticky', top: 20, height: 'fit-content' }}>
          <h3 style={{ marginTop: 0 }}>Anteprima</h3>
          <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            {imagePreview && (
              <img 
                src={imagePreview} 
                alt={title}
                style={{ width: '100%', height: 200, objectFit: 'cover', marginBottom: 8, borderRadius: 4 }}
              />
            )}
            <h3 style={{ margin: '0 0 6px 0', fontSize: 18 }}>{title || 'Titolo'}</h3>
            {description ? <p style={{ margin: '0 0 6px 0', fontSize: 14 }}>{description}</p> : null}
            {address ? <p style={{ margin: '0 0 6px 0', fontSize: 14, color: '#666' }}>📍 {address}</p> : null}
            
            <div style={{ marginBottom: 8, fontSize: 14 }}>
              <div><strong>Prezzo:</strong> €{price || '0'}</div>
              <div><strong>Stanze:</strong> {rooms || '0'}</div>
              <div><strong>Mq:</strong> {squareMeters || '0'} m²</div>
            </div>

            {services ? <p style={{ margin: '0 0 6px 0', fontSize: 13, color: '#555' }}><strong>Servizi:</strong> {services}</p> : null}
          </div>
        </div>
      </div>
    </div>
  )
}
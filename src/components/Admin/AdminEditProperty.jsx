import React, { useState, useEffect } from 'react'
import { supabase } from '../../services/supabase'

export default function AdminEditProperty({ propertyId, onSuccess, onCancel }) {
  const [form, setForm] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const { data, error: err } = await supabase
          .from('properties')
          .select('*')
          .eq('id', propertyId)
          .single()

        if (err) throw new Error(err.message)

        setForm(data)
        setImagePreview(data.image_url)
        setLoading(false)
      } catch (e) {
        setError(String(e))
        setLoading(false)
      }
    }
    load()
  }, [propertyId])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      let imageUrl = form.image_url

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        const { error: err } = await supabase.storage.from('properties-images').upload(fileName, imageFile)
        if (err) throw new Error(err.message)

        const { data } = supabase.storage.from('properties-images').getPublicUrl(fileName)
        imageUrl = data?.publicUrl
      }

      const { error: err } = await supabase
        .from('properties')
        .update({
          title: form.title,
          description: form.description || null,
          address: form.address || null,
          price: Number(form.price),
          rooms: Number(form.rooms),
          square_meters: Number(form.squareMeters),
          services: form.services || null,
          image_url: imageUrl
        })
        .eq('id', propertyId)

      if (err) throw new Error(err.message)

      setSuccess('✓ Aggiornata!')
      setTimeout(() => onSuccess?.(), 1500)
    } catch (e) {
      setError(`✗ ${e.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Caricamento...</div>
  if (error && !form) return <div className="form-alert error">{error}</div>
  if (!form) return null

  return (
    <div className="admin-edit-container">
      <form className="admin-form" onSubmit={handleSubmit}>
        {error && <div className="form-alert error">{error}</div>}
        {success && <div className="form-alert success">{success}</div>}

        <div className="form-grid">
          <div className="form-group">
            <label>Titolo</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Prezzo</label>
            <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Indirizzo</label>
            <input name="address" value={form.address || ''} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Stanze</label>
            <input name="rooms" type="number" value={form.rooms} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mq</label>
            <input name="squareMeters" type="number" value={form.square_meters} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Servizi</label>
            <input name="services" value={form.services || ''} onChange={handleChange} />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Descrizione</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} />
        </div>

        <div className="form-group full-width">
          <label>Immagine</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {imagePreview && <div className="image-preview"><img src={imagePreview} alt="preview" /></div>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Salvataggio...' : 'Salva'}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Annulla
          </button>
        </div>
      </form>

      <aside className="edit-preview">
        <h3>Anteprima</h3>
        <div className="preview-card">
          {imagePreview && <img src={imagePreview} alt="preview" style={{ width: '100%', borderRadius: '3px', marginBottom: '0.75rem' }} />}
          <h4>{form.title}</h4>
          {form.address && <p>📍 {form.address}</p>}
          <p><strong>€</strong> {form.price}</p>
          <p>{form.rooms} stanze • {form.square_meters} m²</p>
          {form.services && <p><small>{form.services}</small></p>}
        </div>
      </aside>
    </div>
  )
}
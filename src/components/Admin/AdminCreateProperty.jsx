import React, { useState } from 'react'
import { supabase } from '../../services/supabase'

export default function AdminCreateProperty({ onSuccess }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    address: '',
    rooms: '',
    squareMeters: '',
    services: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

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
    setSuccess(null)

    if (!form.title.trim() || !form.price || !form.rooms || !form.squareMeters) {
      setError('Completa i campi obbligatori')
      return
    }

    setLoading(true)
    try {
      let imageUrl = null

      if (imageFile) {
        const fileName = `${Date.now()}-${imageFile.name}`
        const { error: uploadError } = await supabase.storage
          .from('properties-images')
          .upload(fileName, imageFile)

        if (uploadError) throw new Error(uploadError.message)

        const { data } = supabase.storage.from('properties-images').getPublicUrl(fileName)
        imageUrl = data?.publicUrl
      }

      const { error: insertError } = await supabase.from('properties').insert([{
        title: form.title.trim(),
        description: form.description.trim() || null,
        address: form.address.trim() || null,
        price: Number(form.price),
        rooms: Number(form.rooms),
        square_meters: Number(form.squareMeters),
        services: form.services.trim() || null,
        image_url: imageUrl
      }])

      if (insertError) throw new Error(insertError.message)

      setSuccess('✓ Proprietà creata!')
      setTimeout(() => onSuccess?.(), 1500)
    } catch (e) {
      setError(`✗ ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="form-alert error">{error}</div>}
      {success && <div className="form-alert success">{success}</div>}

      <div className="form-grid">
        <div className="form-group">
          <label>Titolo *</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Villa..." required />
        </div>

        <div className="form-group">
          <label>Prezzo *</label>
          <input name="price" type="number" step="0.01" value={form.price} onChange={handleChange} placeholder="1500000" required />
        </div>

        <div className="form-group">
          <label>Indirizzo</label>
          <input name="address" value={form.address} onChange={handleChange} placeholder="Via Roma 123" />
        </div>

        <div className="form-group">
          <label>Stanze *</label>
          <input name="rooms" type="number" value={form.rooms} onChange={handleChange} placeholder="4" required />
        </div>

        <div className="form-group">
          <label>Mq *</label>
          <input name="squareMeters" type="number" value={form.squareMeters} onChange={handleChange} placeholder="250" required />
        </div>

        <div className="form-group">
          <label>Servizi</label>
          <input name="services" value={form.services} onChange={handleChange} placeholder="Piscina, Giardino..." />
        </div>
      </div>

      <div className="form-group full-width">
        <label>Descrizione</label>
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrizione..." rows={3} />
      </div>

      <div className="form-group full-width">
        <label>Immagine</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <div className="image-preview"><img src={imagePreview} alt="preview" /></div>}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Creazione...' : 'Crea'}
        </button>
      </div>
    </form>
  )
}
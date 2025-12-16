import React from 'react'
import AdminProperties from './AdminProperties'
import AdminCreateProperty from './AdminCreateProperty'
import AdminEditProperty from './AdminEditProperty'
import './Admin.css'

export default function AdminDashboard({ 
  activeSection, 
  selectedPropertyId, 
  onSelectProperty,
  onBack 
}) {
  console.log('AdminDashboard rendering:', activeSection)
  return (
    <main className="admin-dashboard">
      <div className="dashboard-header">
        <h1>
          {activeSection === 'properties' && 'Gestione Proprietà'}
          {activeSection === 'create' && 'Crea Nuova Proprietà'}
          {activeSection === 'edit' && 'Modifica Proprietà'}
          {activeSection === 'analytics' && 'Statistiche'}
        </h1>
      </div>

      <div className="dashboard-content">
        {activeSection === 'properties' && (
          <AdminProperties onSelectProperty={onSelectProperty} />
        )}
        {activeSection === 'create' && (
          <AdminCreateProperty onSuccess={onBack} />
        )}
        {activeSection === 'edit' && selectedPropertyId && (
          <AdminEditProperty 
            propertyId={selectedPropertyId}
            onSuccess={onBack}
            onCancel={onBack}
          />
        )}
        {activeSection === 'analytics' && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>
            <p>Sezione Statistiche - In sviluppo</p>
          </div>
        )}
      </div>
    </main>
  )
}
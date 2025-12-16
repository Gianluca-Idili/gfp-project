import React, { useState } from 'react'
import AdminSidebar from '../components/Admin/AdminSidebar'
import AdminDashboard from '../components/Admin/AdminDashboard'
import './AdminPage.css'

export default function AdminPage() {
  const [activeSection, setActiveSection] = useState('properties')
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)

  return (
    <div className="admin-page">
      <AdminSidebar 
        activeSection={activeSection}
        onNavigate={setActiveSection}
      />
      <AdminDashboard 
        activeSection={activeSection}
        selectedPropertyId={selectedPropertyId}
        onSelectProperty={(id) => {
          setSelectedPropertyId(id)
          setActiveSection('edit')
        }}
        onBack={() => {
          setActiveSection('properties')
          setSelectedPropertyId(null)
        }}
      />
    </div>
  )
}
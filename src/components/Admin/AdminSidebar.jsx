import React from 'react'
import './Admin.css'

export default function AdminSidebar({ activeSection, onNavigate }) {
  const menuItems = [
    { id: 'properties', label: 'Lista Proprietà', icon: '📋' },
    { id: 'create', label: 'Aggiungi Proprietà', icon: '➕' },
    { id: 'analytics', label: 'Statistiche', icon: '📊' },
  ]

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Pannello Amministrazione</h2>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>Gieffe Patrimoni</p>
        <small>Admin Dashboard</small>
      </div>
    </aside>
  )
}
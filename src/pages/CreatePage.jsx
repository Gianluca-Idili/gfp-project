import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateProperty from '../components/CreateProperty';

const CreatePage = () => {
  const navigate = useNavigate();
  const [successCreated, setSuccessCreated] = useState(false);

  const handleSuccess = () => {
    setSuccessCreated(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="create-page" style={{ maxWidth: 800 }}>
      <header className="page-header">
        <button 
          onClick={() => navigate('/')}
          className="back-btn"
        >
          ← Torna alla Home
        </button>
        <h1>➕ Aggiungi Nuova Proprietà</h1>
      </header>
      
      <main>
        {successCreated && (
          <div style={{ 
            color: 'green', 
            padding: 12, 
            backgroundColor: '#e6ffe6', 
            borderRadius: 4, 
            marginBottom: 20,
            textAlign: 'center'
          }}>
            ✅ Proprietà creata con successo! Reindirizzamento alla home...
          </div>
        )}

        {!successCreated && <CreateProperty onSuccess={handleSuccess} />}
      </main>
    </div>
  );
};

export default CreatePage;
import { useState } from 'react';
import axios from 'axios';

export default function UploadPDF({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function handleFileChange(e) {
    setError(null);
    setFile(e.target.files[0] ?? null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/upload', formData);
      onUploadSuccess();
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao enviar o arquivo';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        disabled={loading}
      />
      <button type="submit" disabled={!file || loading}>
        {loading ? 'Enviando...' : 'Enviar PDF'}
      </button>
      {error && <p style={{ color: '#721c24', margin: 0 }}>{error}</p>}
    </form>
  );
}

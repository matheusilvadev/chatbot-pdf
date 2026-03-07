import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatBox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function handleSubmit(e) {
    e.preventDefault();
    const question = input.trim();
    if (!question || loading) return;

    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post('/api/ask', { question });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (err) {
      const msg = err.response?.data?.error || 'Erro ao obter resposta';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.length === 0 && (
          <p className="empty-hint">Faça uma pergunta sobre o PDF.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.role}`}>
            <span className="bubble">{msg.content}</span>
          </div>
        ))}
        {loading && (
          <div className="message assistant">
            <span className="bubble loading">Aguardando resposta...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <p style={{ color: '#721c24', margin: 0 }}>{error}</p>}

      <form className="input-row" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}

// test deploy
import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi there! I'm your campaign assistant. Let's build your ad strategy!"
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const runAudit = async (url) => {
    try {
      const res = await fetch('/api/analyzeLandingPage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Audit failed', error);
      return { error: 'Audit failed' };
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setLoading(true);

    const response = await runAudit(input);

    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: response?.result || "Sorry, I couldn't analyze that page." }
    ]);
    setInput('');
    setLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem', textAlign: msg.role === 'bot' ? 'left' : 'right' }}>
            <strong>{msg.role === 'bot' ? 'Bot:' : 'You:'}</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter URL to audit"
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? 'Analyzing...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

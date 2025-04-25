import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi there! I'm your campaign assistant. Let's build your ad strategy together. What's your organization’s name?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      const data = await res.json();
      const aiMessage = { role: 'bot', text: data.result || 'No response yet.' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: '⚠️ Error reaching the AI. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <header style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: '600', color: '#1a202c' }}>
            Campaign Builder Assistant
          </h1>
        </header>

        <div style={{ padding: '20px', height: '70vh', overflowY: 'auto' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '10px' }}>
              <div style={{
                backgroundColor: msg.role === 'user' ? '#2b6cb0' : '#edf2f7',
                color: msg.role === 'user' ? '#ffffff' : '#2d3748',
                padding: '12px 18px',
                borderRadius: '20px',
                maxWidth: '70%',
                fontSize: '1rem',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#a0aec0' }}>
              Assistant is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={sendMessage} style={{ padding: '20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', backgroundColor: '#f8fafc' }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e0', fontSize: '1rem' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '12px 20px', backgroundColor: '#2b6cb0', color: '#fff', borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' }}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "👋 Hey! I'm your AI Campaign Assistant. Let’s get your Google Ads campaign started. What's your organization’s name?" }
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
      const aiMessage = { role: 'ai', text: data.result || '🤖 No response from AI.' };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'ai', text: '⚠️ Error communicating with AI.' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div style={{ backgroundColor: '#343541', color: 'white', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>💬 AI Campaign Builder Assistant</h1>

      {/* OAuth Connect Google Ads Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <a
          href="https://accounts.google.com/o/oauth2/v2/auth?client_id=1006122658847-7hilh8sim23on3d3tihcs1j440b6ab0mq.apps.googleusercontent.com&redirect_uri=https://ai-bot-for-marketing-67ol.vercel.app/api/oauth2callback&response_type=code&scope=https://www.googleapis.com/auth/adwords&access_type=offline&prompt=consent"
          style={{
            backgroundColor: '#10a37f',
            color: 'white',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          🔗 Connect Google Ads
        </a>
      </div>

      {/* Chat Message List */}
      <div style={{
        maxWidth: '720px',
        margin: '0 auto',
        background: '#444654',
        borderRadius: '8px',
        padding: '20px',
        overflowY: 'auto',
        height: '70vh'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: '10px'
          }}>
            <div style={{
              background: msg.role === 'user' ? '#1e90ff' : '#555',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '10px',
              maxWidth: '70%',
              whiteSpace: 'pre-wrap'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ color: '#999', fontSize: '0.9rem', padding: '6px' }}>AI is typing...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <form onSubmit={sendMessage} style={{
        display: 'flex',
        maxWidth: '720px',
        margin: '20px auto 0',
        gap: '10px'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message here..."
          style={{
            flexGrow: 1,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '1rem',
            background: '#202123',
            color: 'white'
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#10a37f',
            color: 'white',
            border: 'none',
            padding: '12px 18px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
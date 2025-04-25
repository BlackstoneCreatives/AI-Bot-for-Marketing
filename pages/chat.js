import { useState } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: "👋 Hi there! I'm your AI ads assistant. What's your organization's name?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input })
    });

    const data = await res.json();
    setMessages(prev => [...prev, { sender: 'ai', text: data.result || '🤖 Hmm, I didn’t get that.' }]);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.chatContainer}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.bubble,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#007bff' : '#e5e7eb',
              color: msg.sender === 'user' ? '#fff' : '#111827'
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={styles.inputWrapper}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
}

const styles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f9fafb',
    fontFamily: 'Segoe UI, sans-serif'
  },
  chatContainer: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  bubble: {
    maxWidth: '75%',
    padding: '12px 16px',
    borderRadius: '18px',
    marginBottom: '10px',
    fontSize: '15px',
    lineHeight: 1.4
  },
  inputWrapper: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fff'
  },
  input: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    marginRight: '10px',
    fontSize: '15px'
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 16px',
    fontSize: '15px',
    cursor: 'pointer'
  }
};
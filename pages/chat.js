import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('start'); // <-- new state to track signup steps
  const [signupData, setSignupData] = useState({ email: '', password: '' }); // temp signup storage
  const bottomRef = useRef(null);

  useEffect(() => {
    setMessages([{ role: 'bot', text: '👋 Welcome! Let’s create your account. Please enter your email address:' }]);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);

    if (step === 'start') {
      setSignupData((prev) => ({ ...prev, email: input.trim() }));
      setMessages((prev) => [...prev, { role: 'bot', text: '✅ Email received. Now create a password:' }]);
      setStep('password');
    } else if (step === 'password') {
      setSignupData((prev) => ({ ...prev, password: input.trim() }));
      setMessages((prev) => [...prev, { role: 'bot', text: '🎉 Account created! You’re ready to start onboarding!' }]);
      setStep('onboardingStart');
      // Here you can trigger starting the onboarding questions if you want
    } else if (step === 'onboardingStart') {
      // Later we continue onboarding questions here
    }

    setInput('');
  };

  return (
    <div style={{ padding: '1rem', background: '#0d0d0d', color: '#fff', minHeight: '100vh' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '20px',
              background: msg.role === 'user' ? '#4a90e2' : '#333',
              color: '#fff',
              maxWidth: '80%',
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', marginTop: '1rem', maxWidth: '600px', margin: '0 auto' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            borderRadius: '6px 0 0 6px',
            fontSize: '1rem'
          }}
          placeholder="Type here..."
        />
        <button
          type="submit"
          style={{
            background: '#4a90e2',
            color: '#fff',
            padding: '1rem',
            border: 'none',
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}

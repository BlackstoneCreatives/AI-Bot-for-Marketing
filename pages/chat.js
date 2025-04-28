import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    website: '',
    goals: '',
    budget: '',
  });
  const [signupStep, setSignupStep] = useState(0);

  const signupQuestions = [
    "What's your name?",
    "What's your email?",
    "Create a password.",
    "What's your organization's name?",
    "What's your organization's website?",
    "What's your main marketing goal?",
    "Are you using the $10,000 Google Ad Grant?"
  ];

  const handleInputChange = (e) => setInput(e.target.value);

  const handleSend = async () => {
    if (signupStep < signupQuestions.length) {
      const fields = ['name', 'email', 'password', 'organization', 'website', 'goals', 'budget'];
      setSignupData({ ...signupData, [fields[signupStep]]: input });
      setSignupStep(signupStep + 1);
      setMessages((prev) => [...prev, { role: 'user', text: input }]);
      setInput('');
    } else {
      if (input.toLowerCase() === 'submit signup') {
        await fetch('/api/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(signupData),
        });
        setMessages((prev) => [
          ...prev,
          { role: 'user', text: input },
          { role: 'bot', text: "✅ Thanks for submitting your info!" },
          { role: 'bot', text: "🔒 To activate your account and unlock campaign building, please [click here to complete your subscription](https://buy.stripe.com/4gwdR4aIk08xdVe289)." },
        ]);
        setInput('');
      } else {
        setMessages((prev) => [...prev, { role: 'user', text: input }]);
        setInput('');
      }
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: signupQuestions[0] }]);
    } else if (signupStep < signupQuestions.length && messages[messages.length - 1].role === 'user') {
      setMessages((prev) => [...prev, { role: 'bot', text: signupQuestions[signupStep] }]);
    }
  }, [messages, signupStep]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ minHeight: '400px', marginBottom: '2rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '0.5rem 0', textAlign: m.role === 'bot' ? 'left' : 'right' }}>
            <span style={{ background: m.role === 'bot' ? '#eee' : '#0070f3', color: m.role === 'bot' ? '#000' : '#fff', padding: '0.5rem 1rem', borderRadius: '20px' }}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          style={{ flex: 1, padding: '1rem', borderRadius: '6px 0 0 6px', border: '1px solid #ccc' }}
          placeholder="Type here..."
        />
        <button
          onClick={handleSend}
          style={{ padding: '1rem', border: 'none', background: '#0070f3', color: '#fff', borderRadius: '0 6px 6px 0', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

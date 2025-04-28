import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "👋 Hi there! Welcome! What's your full name?",
    "🏢 What's your organization's name?",
    "🌐 What's your organization's website URL?",
    "📧 What's your best email address?",
    "🔒 Create a password for your account:",
    "💰 Are you planning to use the Google Ad Grant ($10,000/month free ads)? (Answer: Yes / No / Not sure)",
    "🎯 What's your primary goal for running ads? (Options: Increase Donations / Get More Volunteers / Event Promotion / Build Awareness)",
    "✨ (Optional) Tell us what makes your nonprofit unique:",
    "✅ Thanks! Setting up your profile now..."
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!onboardingComplete) {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);

    if (!onboardingComplete) {
      if (onboardingStep < onboardingQuestions.length - 1) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: onboardingQuestions[onboardingStep + 1] },
          ]);
          setOnboardingStep(onboardingStep + 1);
        }, 500);
      } else {
        setOnboardingComplete(true);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: "🎉 You're all set! How can I help you today?" },
          ]);
        }, 500);
      }
    }

    setInput('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', color: 'white' }}>
      <div style={{ marginBottom: '20px', background: '#1f1f1f', borderRadius: '8px', padding: '20px', minHeight: '400px', overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', margin: '10px 0' }}>
            <div style={{
              display: 'inline-block',
              padding: '10px 15px',
              borderRadius: '20px',
              background: msg.role === 'user' ? '#4f46e5' : '#27272a',
              color: 'white',
              maxWidth: '70%',
              wordWrap: 'break-word',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: 'flex', marginTop: '10px' }}>
        <input
          style={{ flex: 1, padding: '10px', borderRadius: '6px 0 0 6px', border: '1px solid #333', background: '#2a2a2a', color: 'white' }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' ? handleSend() : null}
          placeholder="Type your response..."
        />
        <button
          onClick={handleSend}
          style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '0 6px 6px 0', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

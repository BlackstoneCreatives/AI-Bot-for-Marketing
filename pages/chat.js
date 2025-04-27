import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "Welcome! Let's get started. What's your nonprofit's website?",
    "What's your monthly ad budget?",
    "Who is your target audience?",
    "What is your main goal for running ads? (e.g., donations, awareness, volunteers)",
    "Thanks! You're all set!"
  ];

  const quickPrompts = [
    "Show this week's analytics",
    "Request a new campaign",
    "Analyze our landing page",
    "Optimize our targeting"
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showQuickPrompts, setShowQuickPrompts] = useState(false);
  const [accounts, setAccounts] = useState(["Nonprofit A", "Nonprofit B"]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMessages = JSON.parse(localStorage.getItem('messages')) || [];
      const savedAccount = localStorage.getItem('selectedAccount');
      setMessages(savedMessages);
      setSelectedAccount(savedAccount);

      const alreadyOnboarded = localStorage.getItem('onboardingComplete') === 'true';
      if (alreadyOnboarded && savedMessages.length > 0) {
        setShowQuickPrompts(true);
      } else {
        startOnboarding();
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedAccount', selectedAccount);
    }
  }, [selectedAccount]);

  const startOnboarding = () => {
    setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    setOnboardingStep(1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: input }]);
    setInput('');

    if (input.toLowerCase().includes("switch nonprofit account")) {
      handleSwitchAccount();
      return;
    }

    if (onboardingStep > 0 && onboardingStep < onboardingQuestions.length) {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', text: onboardingQuestions[onboardingStep] }]);
        setOnboardingStep(onboardingStep + 1);

        if (onboardingStep === onboardingQuestions.length - 1 && typeof window !== 'undefined') {
          localStorage.setItem('onboardingComplete', 'true');
          setShowQuickPrompts(true);
        }
      }, 500);
    } else {
      setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'bot', text: "Thanks! Let me process that for you." }]);
      }, 500);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setMessages((prev) => [...prev, { role: 'user', text: prompt }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', text: `Here's the response for: "${prompt}" (placeholder)` }]);
    }, 500);
  };

  const handleSwitchAccount = () => {
    const newSelected = prompt(`Which account do you want to manage? Options: ${accounts.join(', ')}`);
    if (accounts.includes(newSelected)) {
      setSelectedAccount(newSelected);
      setMessages((prev) => [...prev, { role: 'bot', text: `✅ You are now managing "${newSelected}" account.` }]);
    } else {
      setMessages((prev) => [...prev, { role: 'bot', text: "⚠️ Invalid choice. Please try again." }]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>AI Campaign Assistant</h1>

      <div style={{ backgroundColor: '#0d1117', padding: '20px', borderRadius: '8px', minHeight: '400px', color: '#c9d1d9' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '12px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              background: msg.role === 'user' ? '#1f6feb' : '#21262d',
              padding: '10px 15px',
              borderRadius: '20px',
              maxWidth: '75%',
              wordWrap: 'break-word',
              fontSize: '1rem'
            }}>
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {showQuickPrompts && (
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(prompt)}
              style={{
                margin: '5px',
                backgroundColor: '#1f6feb',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '10px 15px',
            borderRadius: '6px 0 0 6px',
            border: '1px solid #30363d',
            backgroundColor: '#161b22',
            color: '#c9d1d9'
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#238636',
            color: 'white',
            padding: '0 20px',
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

import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "Welcome! Let's get started. What's your nonprofit's website?",
    "What's your monthly ad budget?",
    "Who is your target audience?",
    "What is your main goal for running ads? (e.g., donations, awareness, volunteer sign-ups)",
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
  const [loading, setLoading] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const storedMessages = localStorage.getItem('chatMessages');
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setLoading(true);

    if (onboardingStep < onboardingQuestions.length - 1) {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'bot', text: onboardingQuestions[onboardingStep + 1] }
        ]);
        setOnboardingStep(prev => prev + 1);
        setLoading(false);
        setInput('');
      }, 500);
    } else {
      // After onboarding, eventually connect to backend API here
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { role: 'bot', text: "Got it! What would you like to do next?" }
        ]);
        setLoading(false);
        setInput('');
      }, 500);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

// --- Agency Account Switching Feature ---

const dummyAccounts = ["SaveTheOcean", "BuildABridge", "HopeForAll", "GreenFuture"];
const [currentAccount, setCurrentAccount] = useState(() => {
  return localStorage.getItem('activeAccount') || dummyAccounts[0];
});

// Handle account switching
const handleSwitchAccount = () => {
  const accountList = dummyAccounts.map((account, index) => `${index + 1}. ${account}`).join('\n');
  const choice = prompt(`Which account do you want to manage?\n${accountList}`);
  const selected = dummyAccounts[parseInt(choice) - 1];
  if (selected) {
    setCurrentAccount(selected);
    localStorage.setItem('activeAccount', selected);
    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: `✅ You are now managing "${selected}" account.` },
    ]);
  } else {
    setMessages((prev) => [
      ...prev,
      { role: 'bot', text: "⚠️ Invalid choice. Please try again." },
    ]);
  }
};

// Check inside your handleSubmit (or whatever function you send messages with):
if (input.toLowerCase().includes("switch nonprofit account")) {
  handleSwitchAccount();
  setInput('');
  return;
}

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto', color: '#fff' }}>
      <div style={{ minHeight: '400px', padding: '1rem', background: '#1a1a1a', borderRadius: '8px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1rem', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <strong>{msg.role === 'user' ? 'You' : 'CampaignBot'}:</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ marginTop: '1rem' }}>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickPrompt(prompt)}
            style={{
              margin: '0.25rem',
              padding: '0.5rem 1rem',
              background: '#333',
              color: '#fff',
              border: '1px solid #555',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      <div style={{ marginTop: '1rem', display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: '0.75rem',
            border: '1px solid #555',
            borderRadius: '6px 0 0 6px',
            fontSize: '1rem',
            background: '#2a2a2a',
            color: '#fff'
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading}
          style={{
            padding: '0.75rem 1rem',
            background: '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '0 6px 6px 0',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
        >
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

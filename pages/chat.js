import React, { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "Welcome! Let's get started. What's your business website?",
    "What's your monthly ad budget?",
    "Who is your target audience?",
    "What is your main goal for running ads? (e.g., leads, sales, brand awareness)",
    "Thanks! You're all set!"
  ];

  const quickPrompts = [
    "Show this week's analytics",
    "Request a new campaign",
    "Analyze a landing page",
    "Optimize my targeting"
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const alreadyOnboarded = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(alreadyOnboarded);

    if (alreadyOnboarded) {
      setMessages([{ role: 'bot', text: "Welcome back! What would you like help with today?" }]);
    } else {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fakeBotTyping = (callback) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, 1000);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    if (!onboardingComplete) {
      fakeBotTyping(() => {
        const nextQuestionIndex = currentQuestion + 1;
        if (nextQuestionIndex < onboardingQuestions.length) {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: onboardingQuestions[nextQuestionIndex] }
          ]);
          setCurrentQuestion(nextQuestionIndex);

          if (nextQuestionIndex === onboardingQuestions.length - 1) {
            localStorage.setItem('onboardingComplete', 'true');
            setOnboardingComplete(true);
          }
        }
      });
    } else {
      fakeBotTyping(() => {
        setMessages((prev) => [
          ...prev,
          { role: 'bot', text: `You asked: "${input}". I'll assist you with that!` }
        ]);
      });
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('onboardingComplete');
    window.location.reload();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '0.5rem', textAlign: msg.role === 'bot' ? 'left' : 'right' }}>
            <strong>{msg.role === 'bot' ? 'Bot:' : 'You:'}</strong> {msg.text}
          </div>
        ))}
        {loading && <div><em>Bot is typing...</em></div>}
        <div ref={messagesEndRef} />
      </div>

      {onboardingComplete && (
        <div style={{ marginBottom: '1rem' }}>
          <strong>Quick Prompts:</strong>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                style={{ padding: '0.5rem', cursor: 'pointer' }}
              >
                {prompt}
              </button>
            ))}
          </div>
          <button
            onClick={resetOnboarding}
            style={{ marginTop: '1rem', padding: '0.5rem', background: 'red', color: 'white', cursor: 'pointer' }}
          >
            Connect New Client
          </button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your response..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleSend} disabled={loading} style={{ padding: '0.5rem 1rem' }}>
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

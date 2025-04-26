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

  // 🚀 UPDATED HERE: Load messages from localStorage
  const [messages, setMessages] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem('chatMessages');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const alreadyOnboarded = localStorage.getItem('onboardingComplete') === 'true';
    setOnboardingComplete(alreadyOnboarded);

    if (!alreadyOnboarded && messages.length === 0) {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 🚀 NEW: Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  const fakeBotTyping = (callback) => {
    setLoading(true);
    setTimeout(() => {
      callback();
      setLoading(false);
    }, 800);
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
    localStorage.removeItem('chatMessages');
    window.location.reload();
  };

  return (
    <div className="container py-4" style={{ maxWidth: '700px' }}>
      <h2 className="text-center mb-4">AI Campaign Assistant</h2>

      <div className="mb-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className="d-flex mb-2" style={{ justifyContent: msg.role === 'bot' ? 'flex-start' : 'flex-end' }}>
            <div
              className={`p-3 rounded ${msg.role === 'bot' ? 'bg-light' : 'bg-primary text-white'}`}
              style={{ maxWidth: '75%', borderRadius: '20px' }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="d-flex mb-2" style={{ justifyContent: 'flex-start' }}>
            <div className="p-3 rounded bg-light" style={{ maxWidth: '75%', borderRadius: '20px' }}>
              <em>Bot is typing...</em>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {onboardingComplete && (
        <div className="mb-3">
          <strong>Quick Prompts:</strong>
          <div className="d-flex flex-wrap mt-2" style={{ gap: '0.5rem' }}>
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="btn btn-outline-primary btn-sm"
              >
                {prompt}
              </button>
            ))}
          </div>
          <button
            onClick={resetOnboarding}
            className="btn btn-danger btn-sm mt-3"
          >
            Connect New Client
          </button>
        </div>
      )}

      <div className="input-group">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="form-control"
          placeholder="Type your message..."
        />
        <button onClick={handleSend} disabled={loading} className="btn btn-primary">
          {loading ? '...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

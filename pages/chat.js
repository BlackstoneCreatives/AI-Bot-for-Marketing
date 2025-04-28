import React, { useState, useEffect } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "Welcome! Let's get you set up. What is your nonprofit's name?",
    "What's your nonprofit's website?",
    "What's your role in the organization?",
    "Would you like to use the $10,000/month Google Ad Grant? (yes/no)",
    "If you don't have it set up, we can walk you through it!",
    "What is your primary goal for ads? (Donations, Volunteers, Awareness, etc.)",
    "Perfect! You're all set. 🚀 Redirecting to payment link now!"
  ];

  const quickPrompts = [
    "Analyze last week's performance",
    "Request a new ad campaign",
    "Suggest optimizations",
    "Switch nonprofit account"
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const storedOnboarding = localStorage.getItem('onboardingComplete') === 'true';
    const storedPaid = localStorage.getItem('isPaid') === 'true';
    setOnboardingComplete(storedOnboarding);
    setIsPaid(storedPaid);

    if (!storedOnboarding) {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);

    if (!onboardingComplete) {
      if (onboardingStep < onboardingQuestions.length - 1) {
        setTimeout(() => {
          setMessages((prev) => [...prev, { role: 'bot', text: onboardingQuestions[onboardingStep + 1] }]);
          setOnboardingStep((prev) => prev + 1);
        }, 500);
      } else {
        localStorage.setItem('onboardingComplete', 'true');
        setOnboardingComplete(true);

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: "🎉 Awesome! To continue, please complete your payment here:" },
            { role: 'bot', text: "👉 [Complete Payment](https://buy.stripe.com/4gwdR4aIk08xdVe289)" },
            { role: 'bot', text: "After payment, type 'I paid' to unlock full access!" }
          ]);
        }, 1000);
      }
    } else {
      if (!isPaid) {
        if (input.trim().toLowerCase() === 'i paid') {
          localStorage.setItem('isPaid', 'true');
          setIsPaid(true);
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: "✅ Thanks! You now have full access. 🚀" }
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'bot', text: "🚫 You must complete payment to access full features. [Click here](https://buy.stripe.com/4gwdR4aIk08xdVe289)" }
          ]);
        }
        return;
      }

      // Paid and Onboarded Users Can Chat Normally
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: `🤖 (Simulated AI Response) You asked: "${input}"` }
      ]);
    }

    setInput('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', backgroundColor: '#0c0c0c', color: '#f5f5f5', height: '100vh' }}>
      <div style={{ overflowY: 'auto', height: '90%' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.role === 'user' ? 'right' : 'left', marginBottom: '10px' }}>
            <span style={{ padding: '8px 12px', background: msg.role === 'user' ? '#0070f3' : '#333', borderRadius: '8px', display: 'inline-block' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex' }}>
        <input
          style={{ flex: 1, padding: '12px', background: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px' }}
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          style={{ marginLeft: '10px', padding: '12px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

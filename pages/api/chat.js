import React, { useState, useEffect } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [accessToken, setAccessToken] = useState(''); // New for campaign check

  const onboardingQuestions = [
    "Welcome! What's your nonprofit name?",
    "What's your website?",
    "What's your monthly marketing goal?",
    "Are you using the $10,000/mo Google Ad Grant yet?",
    "✅ Your initial setup is complete! 🎉",
    "Before launching, let me check your Google Ads account for any existing campaigns..."
  ];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const handleUserInput = async () => {
    if (!onboardingComplete) {
      const currentQuestion = onboardingQuestions[questionIndex];
      setMessages(prev => [...prev, { role: 'user', text: input }]);

      if (questionIndex === onboardingQuestions.length - 2) {
        setOnboardingComplete(true);
        await checkForCampaigns();
      } else {
        setQuestionIndex(prev => prev + 1);
        setMessages(prev => [...prev, { role: 'bot', text: onboardingQuestions[questionIndex + 1] }]);
      }
      setInput('');
    } else {
      setMessages(prev => [...prev, { role: 'user', text: input }]);
      setInput('');
    }
  };

  const checkForCampaigns = async () => {
    setMessages(prev => [...prev, { role: 'bot', text: '🔎 Checking existing campaigns...' }]);

    try {
      const res = await fetch('/api/checkCampaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken }),
      });
      const data = await res.json();

      if (data.hasCampaigns) {
        setMessages(prev => [...prev, { role: 'bot', text: "✅ I found active campaigns! Would you like me to review them for improvements before launching new ads? (Type YES or NO)" }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: "✅ No existing campaigns found. Ready to build your first ad!" }]);
      }
    } catch (error) {
      console.error('Error checking campaigns:', error);
      setMessages(prev => [...prev, { role: 'bot', text: "⚠️ Error checking campaigns. Please try again later." }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleUserInput();
    }
  };

  useEffect(() => {
    setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ height: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '10px', color: msg.role === 'bot' ? 'blue' : 'black' }}>
            <strong>{msg.role === 'bot' ? 'Bot' : 'You'}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type here..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ width: '80%', padding: '10px', fontSize: '16px' }}
      />
      <button onClick={handleUserInput} style={{ padding: '10px', fontSize: '16px' }}>Send</button>
    </div>
  );
}

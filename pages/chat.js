import React, { useState, useEffect } from 'react';

export default function Chat() {
  const onboardingQuestions = [
    "👋 Welcome! Let's set up your nonprofit. What’s your name?",
    "📧 Great! What's your email address?",
    "🔒 Now, create a password you'd like to use.",
    "🏢 What is your organization's name?",
    "🌐 What is your organization's website? (We'll scan it to learn!)",
    "🎯 What is your main goal for running ads? (e.g., donations, volunteers, awareness)",
    "🌎 Where should we target your ads? (e.g., United States, South Carolina, Greenville SC)",
    "💸 Are you planning to use the $10,000/month Google Ad Grant? (yes/no)",
    "✅ First setup complete! 🚀 Now preparing your draft campaign..."
  ];

  const campaignQuestions = [
    "🎯 Let's build your first campaign!",
    "What's the goal for this campaign? (e.g., more donations, event registrations)",
    "Where should your ads be targeted? (city, state, or country)",
    "Any keywords you'd like to target? (optional)",
    "Do you have a specific landing page you'd like the ads to direct to?",
    "🎉 Campaign draft ready! Type 'launch' to go live or 'edit' to adjust."
  ];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [signupData, setSignupData] = useState({});
  const [campaignData, setCampaignData] = useState({});
  const [signedUp, setSignedUp] = useState(false);
  const [paid, setPaid] = useState(false);
  const [buildingCampaign, setBuildingCampaign] = useState(false);

  const handleOnboarding = async (text) => {
    const keys = ['name', 'email', 'password', 'orgName', 'website', 'goal', 'target', 'grant'];
    if (step < keys.length) {
      setSignupData((prev) => ({ ...prev, [keys[step]]: text }));
    }
    if (step === onboardingQuestions.length - 1) {
      // Submit signup to API
      await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupData),
      });
      setSignedUp(true);
      setMessages((prev) => [...prev, { role: 'bot', text: "💳 Please complete payment here: https://buy.stripe.com/4gwdR4aIk08xdVe289 — Then type 'paid' once done!" }]);
    }
    setStep((prev) => prev + 1);
  };

  const handleCampaignBuilding = (text) => {
    const keys = ['campaignGoal', 'campaignLocation', 'campaignKeywords', 'landingPage'];
    if (step - onboardingQuestions.length < keys.length) {
      setCampaignData((prev) => ({ ...prev, [keys[step - onboardingQuestions.length]]: text }));
    }
    if (step - onboardingQuestions.length === campaignQuestions.length - 1) {
      setMessages((prev) => [...prev, { role: 'bot', text: "🎉 Campaign draft ready! Type 'launch' to go live or 'edit' to adjust." }]);
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: 'user', text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);

    if (input.toLowerCase() === 'paid') {
      const response = await fetch('/api/checkPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupData.email }),
      });
      const data = await response.json();
      if (data.paid) {
        setPaid(true);
        setMessages((prev) => [...prev, { role: 'bot', text: "✅ Payment confirmed! Let's start building your campaign." }]);
        setInput('');
        return;
      } else {
        setMessages((prev) => [...prev, { role: 'bot', text: "⚠️ Payment not found yet. Please complete checkout and type 'paid' again!" }]);
        setInput('');
        return;
      }
    }

    if (input.toLowerCase() === 'launch' && buildingCampaign) {
      setMessages((prev) => [...prev, { role: 'bot', text: "🚀 Launching your campaign now! We'll keep you updated with performance reports. Thank you for trusting us!" }]);
      setBuildingCampaign(false);
      setInput('');
      return;
    }

    if (!signedUp) {
      handleOnboarding(input.trim());
    } else if (!paid) {
      setMessages((prev) => [...prev, { role: 'bot', text: '💳 Please complete payment first.' }]);
    } else if (signedUp && paid) {
      if (!buildingCampaign) {
        setMessages((prev) => [...prev, { role: 'bot', text: campaignQuestions[0] }]);
        setStep(onboardingQuestions.length);
        setBuildingCampaign(true);
      } else {
        handleCampaignBuilding(input.trim());
      }
    }

    setInput('');
  };

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: onboardingQuestions[0] }]);
    }
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
      <div style={{ marginBottom: '20px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '10px', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{ padding: '10px', borderRadius: '6px', background: msg.role === 'user' ? '#2e6ad9' : '#444' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '10px', borderRadius: '6px 0 0 6px', border: 'none' }}
        />
        <button type="submit" style={{ padding: '10px 20px', border: 'none', backgroundColor: '#2e6ad9', color: '#fff', borderRadius: '0 6px 6px 0', cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}

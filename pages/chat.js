import React, { useState, useEffect } from 'react';

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

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step === 0) {
      addBotMessage(onboardingQuestions[0]);
    }
  }, []);

  const addBotMessage = (text) => {
    setMessages((msgs) => [...msgs, { text, sender: 'bot' }]);
  };

  const addUserMessage = (text) => {
    setMessages((msgs) => [...msgs, { text, sender: 'user' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addUserMessage(input);

    // Simulated Slack alert trigger
    if (input.toLowerCase().includes("use the advanceai team")) {
      await fetch("/api/slackNotify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "team_request", message: input })
      });
    }

    if (step + 1 < onboardingQuestions.length) {
      setTimeout(() => {
        addBotMessage(onboardingQuestions[step + 1]);
        setStep(step + 1);
      }, 800);
    } else {
      addBotMessage("💳 Ready to launch your first campaign. Type \"paid\" when you’ve completed checkout.");
    }

    setInput("");
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender}`}>{msg.text}</div>
        ))}
      </div>
      <form className="input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your answer..."
          autoFocus
        />
        <button type="submit">
          <span>Send</span>
        </button>
      </form>
      <style jsx>{`
        .chat-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          max-width: 600px;
          margin: 0 auto;
          background: #1a1a1a;
          color: white;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .message {
          margin-bottom: 1rem;
          padding: 0.75rem 1rem;
          border-radius: 8px;
        }
        .message.user {
          background-color: #00c6ff;
          color: #000;
          align-self: flex-end;
        }
        .message.bot {
          background: #333;
          align-self: flex-start;
        }
        .input-form {
          display: flex;
          padding: 1rem;
          border-top: 1px solid #444;
        }
        input {
          flex: 1;
          padding: 0.75rem;
          border-radius: 20px;
          border: none;
          outline: none;
          font-size: 1rem;
        }
        button {
          background: #00c6ff;
          border: none;
          margin-left: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 50px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}


import React, { useState, useEffect } from 'react';
import { saveGoal, getGoal, updateGoalProgress, getGoalProgress } from '../lib/goalManager';
import faqResponses from '../data/faqResponses.json';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);

  const onboardingQuestions = [
    "👋 Welcome! Let’s get you set up. What’s your name?",
    "📧 What’s your email address?",
    "🏢 What’s your nonprofit’s name?",
    "🌐 What’s your nonprofit’s website?",
    "🎯 What’s your main goal for ads? (e.g., donations, volunteers, awareness)",
    "📍 What location should we target? (e.g., United States, SC, Greenville)",
    "💸 Are you using the $10K/month Google Ad Grant? (yes/no)",
    "✅ Onboarding complete! Setting a growth goal for Month 1...",
  ];

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ text: onboardingQuestions[0], sender: 'bot' }]);
    }
  }, []);

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleUserInput = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage(userMessage, 'user');
    setInput('');

    // Bot is typing...
    setTimeout(() => {
      handleBotResponse(userMessage);
    }, 600);
  };

  const handleBotResponse = (userInput) => {
    // Check for FAQ match
    const faq = faqResponses.find((item) =>
      userInput.toLowerCase().includes(item.question.toLowerCase())
    );
    if (faq) {
      addMessage(faq.answer, 'bot');
      return;
    }

    // Continue onboarding
    if (step < onboardingQuestions.length - 1) {
      setStep(step + 1);
      addMessage(onboardingQuestions[step + 1], 'bot');

      // On goal-setting step
      if (step + 1 === onboardingQuestions.length - 1) {
        const goal = "Increase conversions by 25%";
        saveGoal({ month: 1, goal });
        addMessage(`📌 We’ve set your Month 1 goal: ${goal}`, 'bot');
      }

      return;
    }

    // After onboarding – check for goal progress request
    if (userInput.toLowerCase().includes('goal progress')) {
      const progress = getGoalProgress();
      addMessage(`📈 Progress toward your goal: ${progress}`, 'bot');
      return;
    }

    // Default fallback
    addMessage("🤖 I'm still learning. We'll get smarter over time!", 'bot');
  };

  return (
    <div style={styles.chatWrapper}>
      <div style={styles.messages}>
        {messages.map((msg, i) => (
          <div key={i} style={{ ...styles.message, ...(msg.sender === 'user' ? styles.user : styles.bot) }}>
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleUserInput} style={styles.form}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>➤</button>
      </form>
    </div>
  );
}

const styles = {
  chatWrapper: {
    maxWidth: 600,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#121212',
    color: '#fff',
  },
  messages: {
    flex: 1,
    padding: 20,
    overflowY: 'auto',
  },
  message: {
    padding: '12px 16px',
    borderRadius: 12,
    marginBottom: 10,
    maxWidth: '80%',
    lineHeight: 1.5,
  },
  user: {
    alignSelf: 'flex-end',
    background: '#00c6ff',
    color: '#000',
  },
  bot: {
    alignSelf: 'flex-start',
    background: '#333',
    color: '#fff',
  },
  form: {
    display: 'flex',
    padding: 16,
    borderTop: '1px solid #444',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: 24,
    border: 'none',
    outline: 'none',
    fontSize: 16,
    background: '#1f1f1f',
    color: '#fff',
  },
  button: {
    marginLeft: 10,
    background: '#00c6ff',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '50%',
    cursor: 'pointer',
    fontSize: 18,
  },
};

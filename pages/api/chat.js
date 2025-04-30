import React, { useState, useEffect } from 'react';
import faqResponses from '../data/faqResponses.json';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const addMessage = (text, sender) => {
    setMessages((prev) => [...prev, { text, sender }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.trim();
    addMessage(userInput, 'user');
    setInput('');

    // Simulate thinking
    addMessage('...', 'bot');

    const matched = Object.keys(faqResponses).find((key) =>
      userInput.toLowerCase().includes(key.toLowerCase())
    );

    setTimeout(() => {
      setMessages((prev) =>
        prev.filter((msg) => msg.text !== '...')
      );

      if (matched) {
        const possibleAnswers = faqResponses[matched];
        const randomAnswer = Array.isArray(possibleAnswers)
          ? possibleAnswers[Math.floor(Math.random() * possibleAnswers.length)]
          : possibleAnswers;
        addMessage(randomAnswer, 'bot');
      } else {
        addMessage("I'm not sure yet, but we're always learning! 🤖", 'bot');
      }
    }, 1000);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AdvanceAI..."
          />
          <button type="submit">➤</button>
        </form>
      </div>
      <style jsx>{`
        .chat-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background: #0e0e0e;
        }
        .chat-box {
          background: #1a1a1a;
          width: 100%;
          max-width: 500px;
          height: 90vh;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          box-shadow: 0 0 20px rgba(0, 255, 200, 0.15);
          overflow: hidden;
        }
        .messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }
        .message {
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 75%;
          font-size: 15px;
          margin-bottom: 10px;
        }
        .message.user {
          background-color: #00c6ff;
          color: #000;
          align-self: flex-end;
        }
        .message.bot {
          background: linear-gradient(135deg, #3a3f51, #2c2f3a);
          color: #fff;
          align-self: flex-start;
        }
        .input-form {
          display: flex;
          padding: 16px;
          border-top: 1px solid #333;
          background-color: #121212;
        }
        input {
          flex: 1;
          padding: 12px 18px;
          border: none;
          border-radius: 25px;
          background-color: #1f1f1f;
          color: white;
          font-size: 14px;
        }
        input::placeholder {
          color: #888;
        }
        button {
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          border: none;
          padding: 12px;
          margin-left: 10px;
          border-radius: 50%;
          font-size: 18px;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

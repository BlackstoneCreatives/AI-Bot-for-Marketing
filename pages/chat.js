import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const Chat = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch user data and goal
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-goals');
      const data = await response.json();
      if (data.goal) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: `Your current goal: ${data.goal}`, sender: 'bot' },
        ]);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    // Add user input to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, sender: 'user' },
    ]);
    setUserInput('');
    setLoading(true);

    // Send the user input to the backend or AI for processing
    const response = await fetch('/api/ai', {
      method: 'POST',
      body: JSON.stringify({ input: userInput }),
    });
    const data = await response.json();

    setLoading(false);

    // Add bot response to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: data.response, sender: 'bot' },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="header">
        <h2>AdvanceAI</h2>
        <p>Build smarter nonprofit solutions. Eliminate agency costs. Automate your brand growth with AI.</p>
      </div>
      <div className="messages" id="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="message bot">
            <div className="typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      <form className="input-form" id="input-form" onSubmit={handleFormSubmit}>
        <input
          type="text"
          id="user-input"
          placeholder="Ask AdvanceAI..."
          autoComplete="off"
          value={userInput}
          onChange={handleInputChange}
          required
        />
        <button type="submit">
          <span>➤</span>
        </button>
      </form>
    </div>
  );
};

export default Chat;

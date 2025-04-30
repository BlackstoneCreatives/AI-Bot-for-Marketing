import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { fetchUserGoal } from '../lib/goalFetcher';
import { saveUserGoal } from '../lib/goalSaver';

export default function Chat() {
  const [loading, setLoading] = useState(true);
  const [userActive, setUserActive] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [userGoal, setUserGoal] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('access_status, role')
        .eq('id', user.id)
        .single();

      if (profile?.access_status === 'active') {
        setUserActive(true);
        setUserRole(profile.role || 'user');

        const goal = await fetchUserGoal(user.id);
        if (goal) setUserGoal(goal);
      } else {
        setUserActive(false);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { sender: 'user', text: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        sender: 'bot',
        text: `Thanks for your message: "${newMessage.text}"`,
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  if (loading) return <div>Loading...</div>;
  if (!userActive)
    return <div>🚫 You must have an active subscription to use this chat.</div>;

  return (
    <div style={styles.chatContainer}>
      {userGoal && (
        <div style={styles.goalBox}>
          🎯 <strong>Goal:</strong> {userGoal.goal_description} <br />
          📊 <strong>Target:</strong> {userGoal.goal_value}% increase <br />
          🚧 <strong>Progress:</strong> {userGoal.progress_value || 0}%
        </div>
      )}

      <div style={styles.messages}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender === 'user' ? '#007bff' : '#333',
              color: msg.sender === 'user' ? '#fff' : '#eee',
            }}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          placeholder="Ask a question..."
        />
        <button type="submit" style={styles.button}>
          Send
        </button>
      </form>
    </div>
  );
}

const styles = {
  chatContainer: {
    width: '100%',
    maxWidth: 600,
    margin: '0 auto',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#1a1a1a',
    color: '#fff',
  },
  goalBox: {
    padding: '12px 16px',
    backgroundColor: '#111',
    borderBottom: '1px solid #333',
    fontSize: '14px',
  },
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  message: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '80%',
    wordWrap: 'break-word',
  },
  form: {
    display: 'flex',
    borderTop: '1px solid #333',
    backgroundColor: '#121212',
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 14,
    border: 'none',
    outline: 'none',
    color: '#fff',
    backgroundColor: '#222',
  },
  button: {
    padding: '0 16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
  },
};

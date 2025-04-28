export default function Home() {
  return (
    <>
      <div className="chat-container">
        <div className="header">
          <h2>AdvanceAI</h2>
          <p>Build smarter nonprofit solutions. Eliminate agency costs. Automate your brand growth with AI.</p>
        </div>

        <div className="messages" id="messages"></div>

        <form className="input-form" id="input-form">
          <input
            type="text"
            id="user-input"
            placeholder="Ask AdvanceAI..."
            autoComplete="off"
            required
          />
          <button type="submit">
            <span>➤</span>
          </button>
        </form>
      </div>

      <style>{`
        body {
          background-color: #0e0e0e;
          margin: 0;
          font-family: sans-serif;
        }
        .chat-container {
          background: #1a1a1a;
          width: 420px;
          max-width: 90%;
          height: 650px;
          box-shadow: 0 0 20px rgba(0, 255, 200, 0.15);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          margin: 20px auto;
        }
        .header {
          padding: 20px;
          background: #121212;
          border-bottom: 1px solid #2e2e2e;
          text-align: center;
        }
        .header h2 {
          margin: 0;
          font-size: 36px;
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: bold;
        }
        .header p {
          margin-top: 10px;
          font-size: 13px;
          color: #bbb;
        }
        .messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .message {
          margin-bottom: 14px;
          padding: 12px 16px;
          border-radius: 18px;
          max-width: 75%;
          font-size: 15px;
          line-height: 1.4;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .message.user {
          background-color: #00c6ff;
          color: #000;
          align-self: flex-end;
        }
        .message.bot {
          background: linear-gradient(135deg, #3a3f51, #2c2f3a);
          color: #ffffff;
          align-self: flex-start;
        }
        .typing {
          display: flex;
          align-items: center;
        }
        .typing span {
          height: 8px;
          width: 8px;
          margin: 0 2px;
          background-color: #ccc;
          border-radius: 50%;
          animation: blink 1.4s infinite both;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
        .input-form {
          display: flex;
          padding: 16px;
          border-top: 1px solid #333;
          background-color: #121212;
        }
        #user-input {
          flex: 1;
          padding: 12px 18px;
          border: none;
          border-radius: 25px;
          background-color: #1f1f1f;
          color: white;
          outline: none;
          font-size: 14px;
        }
        #user-input::placeholder {
          color: #888;
        }
        button {
          background: linear-gradient(135deg, #00c6ff, #0072ff);
          border: none;
          padding: 12px;
          margin-left: 10px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 18px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease;
        }
        button:hover {
          background: linear-gradient(135deg, #00e6ff, #0055ff);
        }
      `}</style>

      <script dangerouslySetInnerHTML={{
        __html: `
        const form = document.getElementById('input-form');
        const input = document.getElementById('user-input');
        const messages = document.getElementById('messages');

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const userInput = input.value.trim();
          if (!userInput) return;

          addMessage(userInput, 'user');
          input.value = '';

          showTyping();

          setTimeout(() => {
            removeTyping();
            addMessage("AdvanceAI Response: Here's what I found for '" + userInput + "'.", 'bot');
          }, 2000);
        });

        function addMessage(text, sender) {
          const messageEl = document.createElement('div');
          messageEl.classList.add('message', sender);
          messageEl.innerText = text;
          messages.appendChild(messageEl);
          messages.scrollTop = messages.scrollHeight;
        }

        function showTyping() {
          const typingEl = document.createElement('div');
          typingEl.classList.add('message', 'bot');
          typingEl.id = 'typing';
          typingEl.innerHTML = '<div class="typing"><span></span><span></span><span></span></div>';
          messages.appendChild(typingEl);
          messages.scrollTop = messages.scrollHeight;
        }

        function removeTyping() {
          const typingEl = document.getElementById('typing');
          if (typingEl) {
            typingEl.remove();
          }
        }
        `
      }} />
    </>
  );
}

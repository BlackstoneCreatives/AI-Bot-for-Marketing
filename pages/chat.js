import React from 'react';

export default function Home() {
  return (
    <div style={{ 
      backgroundColor: 'black', 
      minHeight: '100vh', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: "'Poppins', sans-serif",
      padding: '40px 20px'
    }}>
      {/* Logo */}
      <img 
        src="/logo.png" 
        alt="AdvanceAI Logo" 
        style={{ width: '100px', marginBottom: '20px' }}
      />

      {/* Heading */}
      <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '10px', color: '#4CC9F0' }}>
        AdvanceAI
      </h1>

      {/* Subheading */}
      <p style={{ fontSize: '1.2rem', textAlign: 'center', maxWidth: '600px', marginBottom: '40px' }}>
        Build smarter nonprofit solutions. Eliminate agency costs. <br /> Automate your brand growth with AI.
      </p>

      {/* Chat Container */}
      <div style={{
        backgroundColor: '#111',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '600px',
        height: '600px',
        padding: '20px',
        boxShadow: '0 0 20px #4CC9F0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Chat iframe or Chat UI */}
        <iframe 
          src="/chat" 
          style={{ 
            width: '100%', 
            height: '100%', 
            border: 'none', 
            borderRadius: '12px' 
          }} 
          title="AdvanceAI Chatbot"
        />
      </div>

      {/* Footer */}
      <footer style={{ marginTop: '40px', fontSize: '0.9rem', color: '#aaa' }}>
        © {new Date().getFullYear()} AdvanceAI. All rights reserved.
      </footer>
    </div>
  );
}

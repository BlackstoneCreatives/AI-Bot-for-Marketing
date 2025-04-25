import { useState } from 'react';

export default function Home() {
  const onboardingQuestions = [
    "What's your organization's name?",
    "What's your website URL?",
    "What's the main goal of your campaign? (donations, awareness, leads, etc.)",
    "What services or offerings are we promoting?",
    "Where are your customers or donors located?",
    "What's your monthly ad budget?",
    "Is there a key message or special offer you'd like to highlight?",
    "⭐️ Do you have any keywords in mind? (No worries if not — I can suggest good ones!)",
    "✅ Do you have a Google Ads account? (yes/no)",
    "✅ Do you have Google Analytics 4 (GA4) set up? (yes/no)",
    "✅ Do you have Google Tag Manager set up? (yes/no)",
    "✅ Have you set up any conversion tracking yet? (like forms, donations?) (yes/no)"
  ];

  const [messages, setMessages] = useState([{ role: 'ai', text: onboardingQuestions[0] }]);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [userInput, setUserInput] = useState('');
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: 'user', text: userInput }];
    setMessages(newMessages);

    if (!onboardingComplete) {
      const fieldNames = [
        'orgName', 'website', 'goal', 'service', 'location', 'budget', 'message',
        'keywords', 'googleAds', 'ga4', 'gtm', 'conversionTracking'
      ];
      const currentField = fieldNames[currentStep];

      setFormData(prev => ({ ...prev, [currentField]: userInput }));
      setUserInput('');

      if (currentStep < onboardingQuestions.length - 1) {
        setCurrentStep(currentStep + 1);
        setMessages(prev => [...prev, { role: 'ai', text: onboardingQuestions[currentStep + 1] }]);
      } else {
        setOnboardingComplete(true);
        setMessages(prev => [...prev, { role: 'ai', text: "Awesome! Generating your first Google Ads campaign draft... 🚀" }]);
        generateCampaign();
      }
    } else {
      // Post-onboarding: Live chat phase
      setUserInput('');
      setMessages(prev => [...prev, { role: 'ai', text: "Got it! Let me think..." }]);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userInput })
      });
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'ai', text: data.result || "No response from AI yet." }]);
    }
  };

  const generateCampaign = async () => {
    setLoading(true);

    const prompt = `
Organization: ${formData.orgName}
Website: ${formData.website}
Goal: ${formData.goal}
Service: ${formData.service}
Location: ${formData.location}
Budget: ${formData.budget}
Key Message: ${formData.message}
Keywords (optional): ${formData.keywords}

IMPORTANT: Ensure the campaign complies with all Google Ad Grants rules. Only Search campaigns allowed, minimum CTR 5%, no commercial intent keywords, mission-based targeting only.

Build a complete Google Ads campaign plan including:
- Campaign name
- 1-2 Ad groups
- Keyword lists (with match types)
- 2 ad variations
- Suggested bidding strategy
- Daily budget recommendation
`;

    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    setLoading(false);

    setMessages(prev => [...prev, { role: 'ai', text: data.result || "No response from AI." }]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🧠 AI Campaign Builder Assistant</h1>

      <div className="w-full max-w-2xl bg-white shadow p-4 rounded-md flex flex-col space-y-3 overflow-y-auto h-[600px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={msg.role === 'ai' ? 'text-left' : 'text-right'}>
            <span className={msg.role === 'ai' ? 'text-blue-600' : 'text-green-600'}>
              {msg.text}
            </span>
          </div>
        ))}
        {loading && <div className="text-center text-gray-400">Generating campaign...</div>}
      </div>

      <div className="w-full max-w-2xl mt-4 flex space-x-2">
        <input
          type="text"
          className="border border-gray-300 p-2 rounded flex-1"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your answer..."
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages) || !process.env.OPENAI_API_KEY) {
    return res.status(400).json({ error: 'Missing messages array or API key' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
You are an AI Google Ads strategist trained to help nonprofits and small businesses build high-performing, compliant ad campaigns. Follow these rules carefully:

🧩 Strategy Rules:
• Always use location-specific keywords for local targeting.
• Avoid Smart Campaigns unless monthly budget exceeds $1000.
• Use only Search campaigns for Ad Grants — no Display allowed.
• Target CTR of 3.5% minimum; pause low-performing ads.
• Use RSAs with at least 5 headlines and 3 descriptions.
• Always track conversions with GA4 or Google Tag Manager.

🛑 Compliance Rules:
• Campaigns must align with the nonprofit’s mission.
• No misleading claims, keyword stuffing, or clickbait.
• Enforce all Google Ad Grant policies.

💬 Tone:
• Friendly, confident, strategic.
• Explain recommendations clearly.
• Always back up suggestions with reasoned logic.

🙅 Pushback Behavior:
• If a requested action would hurt performance or compliance:
    - Push back politely but firmly.
    - Offer a better alternative.
    - Briefly educate the user on why it's better.

📈 Conversion Mindset:
• Think like a growth marketer: suggest landing page improvements if weak.
• Focus on maximizing form submissions, donations, or calls.

Follow additional best practices from:
https://notion.so/Google-Ads-Best-Practices-1e0afca27278809e9d5ad8afa12fcb16
            `
          },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ result });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
}
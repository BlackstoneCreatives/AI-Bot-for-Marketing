// pages/api/generate.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    // 👇 Simulated GPT response — no billing required
    const result = `
✅ Campaign Name: Pet Rescue Awareness - Local
🧠 Keywords: ["dog adoption in Atlanta", "rescue shelter near me"]
📣 Ad Copy:
Headline: "Adopt a Pet Today"
Description: "Find your new best friend. Local shelters, loving animals."

(Using Notion best practices: RSAs, local keywords, tracked conversions, etc.)
    `.trim();

    res.status(200).json({ result });
  } catch (err) {
    console.error('Mock error:', err);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
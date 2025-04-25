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
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
You are an expert Google Ads strategist.

✅ Help the user adjust or improve their campaign.
✅ Follow Google Ad Grants compliance strictly (only Search, minimum CTR 5%, no Display, mission-based keywords).
✅ If a user asks for something that could harm performance or break rules, push back politely and offer a better alternative.
            `
          },
          ...messages
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content?.trim();

    res.status(200).json({ result });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
}
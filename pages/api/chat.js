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
You are a senior-level Google Ads strategist.

✅ Guide the user through Google Ad Grant setup and compliance (Search only, no Display, CTR > 5%, mission-related keywords).
✅ Offer strategy, push back on poor decisions, and explain better approaches.
✅ Keep your responses clear, friendly, and professional.
✅ Follow best practices from: https://notion.so/Google-Ads-Best-Practices-1e0afca27278809e9d5ad8afa12fcb16
            `
          },
          ...messages
        ],
        temperature: 0.7
      }),
    });

    const data = await response.json();
    const result = data?.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ result });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Error talking to OpenAI' });
  }
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key in environment' });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI Error:", data);
      throw new Error(data.error?.message || 'OpenAI API request failed');
    }

    const result = data.choices?.[0]?.message?.content || "No content returned from OpenAI.";
    res.status(200).json({ result });
  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).json({ error: err.message || "Something went wrong." });
  }
}
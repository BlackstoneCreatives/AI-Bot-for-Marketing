export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST allowed' });
  }

  const { prompt } = req.body;
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const NOTION_PAGE_ID = process.env.NOTION_PAGE_ID;
  const NOTION_API_KEY = process.env.NOTION_API_KEY;

  let bestPractices = '';

  // Optional: Pull best practices from Notion
  if (NOTION_API_KEY && NOTION_PAGE_ID) {
    try {
      const notionRes = await fetch(`https://api.notion.com/v1/blocks/${NOTION_PAGE_ID}/children`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json'
        }
      });

      const data = await notionRes.json();
      bestPractices = data?.results
        ?.map(block => block?.paragraph?.rich_text?.[0]?.plain_text)
        .filter(Boolean)
        .join('\n') || '';
    } catch (error) {
      console.warn('Failed to fetch Notion data:', error);
    }
  }

  const finalPrompt = `
Here are the latest Google Ads best practices to follow:
${bestPractices}

Based on this input:
${prompt}
`;

  // Temporary: return mock output while not using paid API
  return res.status(200).json({
    result: `✅ Mock campaign generated!\n\n📣 Campaign Name: Test Campaign\n🎯 Ad Group: Sample Ad Group\n🔑 Keywords: "test service" [exact], "test near me" [phrase]\n✍️ Headlines: "Support Local Cause", "Make a Difference Today"\n📝 Descriptions: "Help us reach our goal with a small donation today.", "Join our mission to make change."`
  });

  // If using real API later, uncomment this:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: finalPrompt }],
      temperature: 0.7
    })
  });

  const json = await response.json();
  const output = json.choices?.[0]?.message?.content || 'No response from AI';
  return res.status(200).json({ result: output });
  */
}
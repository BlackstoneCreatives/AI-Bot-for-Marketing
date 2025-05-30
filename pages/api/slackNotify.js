export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, service } = req.body;

  const message = {
    text: `📩 New AdvanceAI Team Setup Request!\n\n👤 Name: ${name}\n📧 Email: ${email}\n🛠️ Service: ${service}`,
  };

  try {
    const response = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      throw new Error(`Slack API error: ${response.statusText}`);
    }

    res.status(200).json({ message: 'Notification sent to Slack!' });
  } catch (error) {
    console.error('Slack notification error:', error);
    res.status(500).json({ message: 'Failed to send notification to Slack' });
  }
}

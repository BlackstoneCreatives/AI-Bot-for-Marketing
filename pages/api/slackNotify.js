export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { name, email, request } = req.body;

  const payload = {
    text: `📬 *New AdvanceAI Request*\n• Name: ${name}\n• Email: ${email}\n• Request: ${request}`,
  };

  await fetch("https://hooks.slack.com/services/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", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  res.status(200).json({ success: true });
}

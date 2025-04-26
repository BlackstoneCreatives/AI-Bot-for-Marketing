export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Missing authorization code' });
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'https://ai-bot-for-marketing-67ol.vercel.app/api/oauth2callback',
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();

    if (tokenData.error) {
      return res.status(500).json({ error: tokenData.error_description });
    }

    // Store tokens in session or DB (future)
    console.log('Access Token:', tokenData.access_token);

    res.redirect('/chat'); // or wherever you want post-auth users to land
  } catch (err) {
    console.error('OAuth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
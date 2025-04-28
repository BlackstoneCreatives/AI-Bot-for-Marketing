import { google } from 'googleapis';

export default async function handler(req, res) {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ error: 'Missing access token' });
  }

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  const ads = google.ads({
    version: 'v13', // Adjust if newer available
    auth,
  });

  try {
    const customer = ads.customers;
    const response = await customer.listAccessibleCustomers();
    const customerIds = response.data.resourceNames?.map((name) => name.split('/')[1]);

    if (!customerIds || customerIds.length === 0) {
      return res.json({ hasCampaigns: false });
    }

    const customerId = customerIds[0]; // Just pick the first one for now

    const service = google.googleAds({ version: 'v13', auth });
    const query = `
      SELECT campaign.id FROM campaign
      WHERE campaign.status != 'REMOVED'
      LIMIT 1
    `;

    const request = {
      customerId,
      query,
    };

    const result = await service.customers.googleAds.search(request);

    if (result.data.results && result.data.results.length > 0) {
      res.json({ hasCampaigns: true });
    } else {
      res.json({ hasCampaigns: false });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error checking campaigns' });
  }
}

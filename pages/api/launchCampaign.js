import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { clientEmail, clientId, targetLocation, campaignGoal } = req.body;

  if (!clientEmail || !clientId || !targetLocation || !campaignGoal) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/adwords',
      ],
    });

    const authClient = await auth.getClient();
    const googleAds = google.googleads({ version: 'v14', auth: authClient });

    // Live campaign creation request (MVP real version!)
    const campaignPayload = {
      customerId: clientId,
      operations: [
        {
          create: {
            name: `Nonprofit Campaign - ${campaignGoal}`,
            status: 'PAUSED', // start paused so user can review first
            advertisingChannelType: 'SEARCH',
            manualCpc: {},
            campaignBudget: {
              amountMicros: 10000000, // $10,000 Google Ad Grant (Micros = millionths of a dollar)
            },
            geoTargetTypeSetting: {
              positiveGeoTargetType: 'PRESENCE_OR_INTEREST',
              negativeGeoTargetType: 'PRESENCE_OR_INTEREST',
            },
            targetingSetting: {
              targetingDimensions: [
                {
                  targetingDimension: 'GEO_TARGET',
                  bidOnly: false,
                },
              ],
            },
          },
        },
      ],
    };

    const response = await googleAds.customers.campaigns.mutate(campaignPayload);

    return res.status(200).json({ message: 'Campaign created successfully', data: response.data });
  } catch (error) {
    console.error('Launch Campaign Error:', error);
    return res.status(500).json({ message: 'Failed to launch campaign', error: error.message });
  }
}

import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SECRET });

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, organizationName, websiteUrl, goal, budgetChoice } = req.body;

  try {
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name || '',
              },
            },
          ],
        },
        Email: {
          email: email || '',
        },
        "Organization Name": {
          rich_text: [
            {
              text: {
                content: organizationName || '',
              },
            },
          ],
        },
        "Website URL": {
          url: websiteUrl || '',
        },
        Goal: {
          rich_text: [
            {
              text: {
                content: goal || '',
              },
            },
          ],
        },
        "Budget Choice": {
          rich_text: [
            {
              text: {
                content: budgetChoice || '',
              },
            },
          ],
        },
      },
    });

    res.status(200).json({ message: 'Signup saved successfully!' });
  } catch (error) {
    console.error('Error saving signup to Notion:', error.message);
    res.status(500).json({ error: 'Failed to save signup' });
  }
}

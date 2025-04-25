import { JSDOM } from 'jsdom';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  try {
    const html = await fetch(url).then(res => res.text());
    const dom = new JSDOM(html);
    const textContent = dom.window.document.body.textContent;

    const prompt = `You are a Landing Page Audit Expert. Rate the following landing page content from 0–100 based on ad-readiness: message clarity, CTA visibility, visual hierarchy, page load speed (estimated), mobile-friendliness, and simplicity. After rating, suggest 3–5 practical improvements if needed. Keep your tone positive and professional. Here is the page content:\n\n${textContent}`;

    const chat = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    const result = chat.choices[0].message.content;
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to analyze landing page' });
  }
}
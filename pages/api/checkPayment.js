import { buffer } from 'micro';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  const buf = await buffer(req);
  const rawBody = buf.toString('utf-8');
  const { email } = JSON.parse(rawBody);

  try {
    // Search for a customer by email
    const customers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return res.status(404).json({ paid: false, message: 'Customer not found' });
    }

    const customerId = customers.data[0].id;

    // Look for completed payment intents for that customer
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 5, // Look at last 5
    });

    const paid = paymentIntents.data.some(
      (intent) => intent.status === 'succeeded'
    );

    if (paid) {
      return res.status(200).json({ paid: true });
    } else {
      return res.status(404).json({ paid: false, message: 'No successful payment found' });
    }
  } catch (error) {
    console.error('Error checking payment:', error);
    return res.status(500).json({ paid: false, message: 'Server error' });
  }
}

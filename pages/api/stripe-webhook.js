import { buffer } from 'micro';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-08-16',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Disable body parsing (required for Stripe)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const customerId = event.data.object.customer;

  // Handle events
  if (event.type === 'customer.subscription.created' || event.type === 'invoice.paid') {
    await supabase
      .from('users')
      .update({ is_active: true })
      .eq('stripe_customer_id', customerId);
  }

  if (event.type === 'customer.subscription.deleted') {
    await supabase
      .from('users')
      .update({ is_active: false })
      .eq('stripe_customer_id', customerId);
  }

  res.status(200).json({ received: true });
}

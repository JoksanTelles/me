import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import { pb } from '../../../lib/pocketbase';

// In Astro SSR, API routes can access env variables via import.meta.env or process.env
const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-05-27.dahlia',
});

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = import.meta.env.STRIPE_WEBHOOK_SECRET;

  let event;
  const rawBody = await request.text();

  try {
    if (!sig || !webhookSecret) throw new Error("Missing signature or secret");
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 1. Log the event to payment_logs for big data and auditing
  try {
    // Autenticar como admin para poder escribir en PocketBase desde el backend
    await pb.admins.authWithPassword('admin@joksan.dev', '1234567890');

    await pb.collection('payment_logs').create({
      event_type: event.type,
      payload: event.data.object,
      status: 'received'
    });
  } catch(e) {
    console.error("Error logging webhook to PocketBase:", e);
    // Continue processing even if log fails
  }

  // 2. Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { user_id, course_id } = paymentIntent.metadata;

      if (user_id && course_id) {
        try {
          // Check if purchase already exists
          const existing = await pb.collection('purchases').getList(1, 1, {
            filter: `stripe_payment_intent_id="${paymentIntent.id}"`
          });

          if (existing.totalItems === 0) {
            const course = await pb.collection('courses').getOne(course_id);
            let expires_at = "";
            if (course.access_days > 0) {
               const date = new Date();
               date.setDate(date.getDate() + course.access_days);
               expires_at = date.toISOString();
            }

            await pb.collection('purchases').create({
              user_id: user_id,
              course_id: course_id,
              amount: paymentIntent.amount / 100, // back to normal currency
              status: 'completed',
              stripe_payment_intent_id: paymentIntent.id,
              expires_at: expires_at
            });
          }
        } catch(e) {
          console.error("Error creating purchase in DB:", e);
        }
      }
      break;
    
    case 'payment_intent.payment_failed':
      // Handle failed payment (e.g., log it, notify user)
      break;
      
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
};

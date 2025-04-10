import { Stripe } from 'stripe';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import type { NextRequest } from 'next/server';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Removed explicit API version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const rustServiceUrl = process.env.RUST_SERVICE_WEBHOOK_URL!;

// Placeholder function to notify your Rust service
// Adapt the payload based on what your Rust service needs
async function notifyRustService(eventType: string, data: any) {
  if (!rustServiceUrl) {
    console.warn('RUST_SERVICE_WEBHOOK_URL is not set. Cannot notify Rust service.');
    return;
  }

  try {
    const payload = {
      event_type: eventType,
      stripe_data: data,
      // Add any other relevant info, like extracting userId from metadata if available
      // userId: data.metadata?.userId,
    };

    console.log(`Sending event ${eventType} to Rust service at ${rustServiceUrl}`);
    const response = await fetch(rustServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any necessary auth headers for your Rust service
        // 'Authorization': `Bearer ${YOUR_RUST_SERVICE_AUTH_TOKEN}`
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Rust service notification failed: ${response.status} ${response.statusText}`);
    }

    console.log(`Successfully notified Rust service for event ${eventType}`);

  } catch (error) {
    console.error('Error notifying Rust service:', error);
    // Implement retry logic or alerting if necessary
  }
}

export async function POST(req: NextRequest) {
  try {
    const buf = await req.text();
    const sig = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    console.log(`Received Stripe event: ${event.type}`);
    const eventData = event.data.object as any; // Cast to 'any' for easier access, handle with care

    switch (event.type) {
      case 'checkout.session.completed':
        // This event occurs when a Checkout Session is successful.
        // It might trigger the initial subscription creation or a one-time payment.
        // You might already handle subscription creation via 'customer.subscription.created'
        // Check the 'mode' (subscription or payment) if needed.
        console.log('Checkout session completed:', eventData.id);
        // Example: Extract userId from metadata if you added it during session creation
        const userId = eventData.metadata?.userId;
        if (userId) {
          console.log(`Checkout linked to internal user ID: ${userId}`);
          // Potentially update user status or grant initial credits here,
          // although subscription events are usually better for granting recurring credits.
        }
        // Notify Rust service if needed for this event
        await notifyRustService(event.type, eventData);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        // Occurs when a subscription is created or updated (e.g., plan change, renewal)
        console.log(`Subscription ${event.type}:`, eventData.id, `Status: ${eventData.status}`);
        // Get customer data to access metadata containing userId
        const customerResponseUpdated = await stripe.customers.retrieve(eventData.customer as string);
        let userIdSubscriptionUpdated: string | null | undefined = null;
        // Check if the customer is not deleted before accessing metadata
        if (customerResponseUpdated && !customerResponseUpdated.deleted) {
            userIdSubscriptionUpdated = (customerResponseUpdated as Stripe.Customer).metadata?.userId;
        }

        // Notify Rust service to update subscription status and potentially grant credits
        await notifyRustService(event.type, {
            subscriptionId: eventData.id,
            customerId: eventData.customer,
            status: eventData.status,
            planId: eventData.items.data[0]?.price.id, // Get the price ID
            currentPeriodEnd: eventData.current_period_end,
            // Add userId from customer metadata if available
            userId: eventData.metadata?.userId || userIdSubscriptionUpdated
        });
        break;

      case 'customer.subscription.deleted':
        // Occurs when a subscription is canceled at the end of the billing period or immediately
        console.log(`Subscription deleted:`, eventData.id, `Status: ${eventData.status}`);
        // Get customer data to access metadata containing userId
        const customerResponseDeleted = await stripe.customers.retrieve(eventData.customer as string);
        let userIdSubscriptionDeleted: string | null | undefined = null;
        // Check if the customer is not deleted before accessing metadata
        if (customerResponseDeleted && !customerResponseDeleted.deleted) {
             userIdSubscriptionDeleted = (customerResponseDeleted as Stripe.Customer).metadata?.userId;
        }
        // Notify Rust service to update subscription status (e.g., revoke access/credits at period end)
        await notifyRustService(event.type, {
            subscriptionId: eventData.id,
            customerId: eventData.customer,
            status: eventData.status,
            userId: eventData.metadata?.userId || userIdSubscriptionDeleted
        });
        break;

      // Add other event types to handle as needed (e.g., payment_failed)
      // case 'invoice.payment_failed':
      //   console.log('Invoice payment failed:', eventData.id);
      //   await notifyRustService(event.type, eventData);
      //   break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({ received: true });

  } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
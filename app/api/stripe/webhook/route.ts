import { Stripe } from "stripe";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // Removed explicit API version
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
const rustServiceUrl = process.env.RUST_SERVICE_WEBHOOK_URL!;
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function notifyRustService(eventType: string, data: any) {
  if (!rustServiceUrl) {
    console.warn(
      "RUST_SERVICE_WEBHOOK_URL is not set. Cannot notify Rust service."
    );
    return;
  }

  try {
    const payload = {
      event_type: eventType,
      stripe_data: data,
    };

    console.log(
      `Sending event ${eventType} to Rust service at ${rustServiceUrl}`
    );
    const response = await fetch(rustServiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(
        `Rust service notification failed: ${response.status} ${response.statusText}`
      );
    }

    console.log(`Successfully notified Rust service for event ${eventType}`);
  } catch (error) {
    console.error("Error notifying Rust service:", error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const buf = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: `Webhook Error: ${err.message}` },
        { status: 400 }
      );
    }

    // Handle the event
    console.log(`Received Stripe event: ${event.type}`);
    const eventData = event.data.object as any; // Cast to 'any' for easier access, handle with care

    switch (event.type) {
      case "checkout.session.completed": {
        console.log("Checkout session completed:", eventData);
        // Only handle one-time payment (credit top-up) sessions
        if (eventData.mode === "payment" && eventData.metadata?.account_id) {
          const accountId = eventData.metadata.account_id;
          // Stripe amount is in cents, convert to credits as needed
          const amount = eventData.amount_total; // e.g., 1000 = $10.00
          const paymentIntentId = eventData.payment_intent;
          const paymentIntent =
            await stripe.paymentIntents.retrieve(paymentIntentId);
          const paymentMethodId = paymentIntent.payment_method as string;

          console.log("paymentIntentId", paymentIntentId);
          console.log("paymentMethodId", paymentMethodId);

          // Idempotency: check if this paymentIntent has already been processed
          const { data: existing, error: existingError } = await supabase
            .from("credit_transactions")
            .select("id")
            .eq("stripe_payment_intent_id", paymentIntentId)
            .maybeSingle();
          console.log("existing", existing);
          if (existing) break; // Already processed

          // Store default payment method if present
          if (paymentMethodId) {
            try {
              const paymentIntentCustomer = paymentIntent.customer as string;
              console.log("paymentIntentCustomer", paymentIntentCustomer);
              if (paymentIntentCustomer) {
                // First, check if this payment method is already attached to the customer
                const customerPaymentMethods = await stripe.paymentMethods.list(
                  {
                    customer: paymentIntentCustomer,
                    type: "card",
                  }
                );

                const isAlreadyAttached = customerPaymentMethods.data.some(
                  (pm) => pm.id === paymentMethodId
                );

                let validPaymentMethodId = paymentMethodId;

                console.log("isAlreadyAttached", isAlreadyAttached);

                if (!isAlreadyAttached) {
                  try {
                    // Try to attach if not already attached
                    await stripe.paymentMethods.attach(paymentMethodId, {
                      customer: paymentIntentCustomer,
                    });
                  } catch (attachError: any) {
                    // If we can't attach this payment method (already used without customer)
                    if (attachError?.type === "StripeInvalidRequestError") {
                      console.log(
                        "Cannot reuse payment method, retrieving details to create a new one"
                      );

                      // Get the payment method details
                      const paymentMethod =
                        await stripe.paymentMethods.retrieve(paymentMethodId);

                      if (paymentMethod.card) {
                        // Create a new SetupIntent to securely collect the card details again
                        console.log(
                          "Creating setup intent for future payments"
                        );
                        const setupIntent = await stripe.setupIntents.create({
                          customer: paymentIntentCustomer,
                          payment_method_types: ["card"],
                          usage: "off_session",
                        });

                        // We can't automatically create a new payment method here
                        // Instead, log this so we know to prompt the user to add a new payment method
                        console.log(
                          "User needs to add a new payment method. SetupIntent created:",
                          setupIntent.id
                        );

                        // Skip updating the default payment method
                        validPaymentMethodId = null;
                      }
                    } else {
                      // Rethrow if it's a different error
                      throw attachError;
                    }
                  }
                }

                // Only update the default if we have a valid payment method
                if (validPaymentMethodId) {
                  // Set as default for invoices
                  await stripe.customers.update(paymentIntentCustomer, {
                    invoice_settings: {
                      default_payment_method: validPaymentMethodId,
                    },
                  });

                  console.log("updating default payment method");
                  await supabase
                    .from("accounts")
                    .update({
                      default_payment_method: validPaymentMethodId,
                      stripe_price_id: eventData.metadata?.price_id,
                    })
                    .eq("id", accountId);
                }
              }
            } catch (err) {
              console.warn(
                `Error handling payment method ${paymentMethodId}:`,
                err
              );
              // Continue processing the webhook even if payment method handling fails
            }
          }

          const payload = {
            account_id: accountId,
            amount: amount,
          };

          console.log("payload", payload);

          // Update credit balance atomically (assume 1 cent = 1 credit for now)
          const { error: updateError } = await supabase.rpc(
            "increment_credit_balance",
            payload
          );
          if (updateError) throw updateError;

          // Insert credit transaction
          await supabase.from("credit_transactions").insert({
            account_id: accountId,
            amount: amount,
            transaction_type: "purchase",
            stripe_payment_intent_id: paymentIntentId,
          });

          // Debug: log eventData and intended update
          console.log(
            "Updating stripe_price_id for account",
            accountId,
            "to",
            eventData.metadata?.price_id
          );
          console.log("eventData in checkout.session.completed", eventData);

          // Update the account's stripe_price_id for pay-as-you-go
          const { error: priceUpdateError } = await supabase
            .from("accounts")
            .update({
              stripe_price_id: eventData.metadata?.price_id,
            })
            .eq("id", accountId);
          if (priceUpdateError) {
            console.error(
              "Failed to update stripe_price_id:",
              priceUpdateError
            );
          }
        }
        await notifyRustService(event.type, eventData);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        console.log(
          `Subscription ${event.type}:`,
          eventData.id,
          `Status: ${eventData.status}`,
          "eventData",
          eventData
        );
        const customerResponseUpdated = await stripe.customers.retrieve(
          eventData.customer as string
        );
        let userIdSubscriptionUpdated: string | null | undefined = null;
        let accountIdSubscriptionUpdated: string | null | undefined = null;
        if (customerResponseUpdated && !customerResponseUpdated.deleted) {
          userIdSubscriptionUpdated = (
            customerResponseUpdated as Stripe.Customer
          ).metadata?.userId;
          accountIdSubscriptionUpdated = (
            customerResponseUpdated as Stripe.Customer
          ).metadata?.account_id;
        }
        if (accountIdSubscriptionUpdated) {
          await supabase
            .from("accounts")
            .update({
              stripe_customer_id: eventData.customer,
              stripe_subscription_id: eventData.id,
              stripe_price_id: eventData.items.data[0]?.price.id,
            })
            .eq("id", accountIdSubscriptionUpdated);

          // --- Begin crediting logic for subscriptions ---
          // Placeholder: determine credits from price amount
          let creditsToGrant = 0;
          try {
            // Try to get the price amount from Stripe
            const priceId = eventData.items.data[0]?.price.id;
            if (priceId) {
              const price = await stripe.prices.retrieve(priceId);
              // price.unit_amount is in cents, e.g., 19900 = $199.00
              if (price && price.unit_amount) {
                // Example: 1 cent = 1 credit (adjust as needed)
                creditsToGrant = price.unit_amount;
              }
            }
          } catch (err) {
            console.warn(
              "Could not determine subscription price amount for crediting.",
              err
            );
          }
          // Fallback: if not found, use a default
          if (!creditsToGrant) creditsToGrant = 10000; // Placeholder default

          // Update credit balance atomically
          const { error: updateError } = await supabase.rpc(
            "increment_credit_balance",
            {
              account_id: accountIdSubscriptionUpdated,
              amount: creditsToGrant,
            }
          );
          if (updateError) throw updateError;

          // Insert credit transaction
          await supabase.from("credit_transactions").insert({
            account_id: accountIdSubscriptionUpdated,
            amount: creditsToGrant,
            transaction_type: "subscription",
            stripe_payment_intent_id: null,
          });
          // --- End crediting logic for subscriptions ---
        }
        await notifyRustService(event.type, {
          subscriptionId: eventData.id,
          customerId: eventData.customer,
          status: eventData.status,
          planId: eventData.items.data[0]?.price.id, // Get the price ID
          currentPeriodEnd: eventData.current_period_end,
          // Add userId from customer metadata if available
          userId: eventData.metadata?.userId || userIdSubscriptionUpdated,
        });
        break;
      }

      case "customer.subscription.deleted":
        console.log(
          `Subscription deleted:`,
          eventData.id,
          `Status: ${eventData.status}`
        );
        const customerResponseDeleted = await stripe.customers.retrieve(
          eventData.customer as string
        );
        let userIdSubscriptionDeleted: string | null | undefined = null;
        let accountIdSubscriptionDeleted: string | null | undefined = null;
        if (customerResponseDeleted && !customerResponseDeleted.deleted) {
          userIdSubscriptionDeleted = (
            customerResponseDeleted as Stripe.Customer
          ).metadata?.userId;
          accountIdSubscriptionDeleted = (
            customerResponseDeleted as Stripe.Customer
          ).metadata?.account_id;
        }
        if (accountIdSubscriptionDeleted) {
          await supabase
            .from("accounts")
            .update({
              stripe_customer_id: eventData.customer,
              stripe_subscription_id: null,
              stripe_price_id: null,
            })
            .eq("id", accountIdSubscriptionDeleted);
        }
        await notifyRustService(event.type, {
          subscriptionId: eventData.id,
          customerId: eventData.customer,
          status: eventData.status,
          userId: eventData.metadata?.userId || userIdSubscriptionDeleted,
        });
        break;

      default:
        console.warn(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

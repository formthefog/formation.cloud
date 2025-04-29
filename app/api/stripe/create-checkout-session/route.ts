import { Stripe } from "stripe";
import { NextResponse, NextRequest } from "next/server";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion: '2024-06-20', // Removed explicit API version
});

// Placeholder function for verifying the token and getting user data
// Replace this with your actual authentication logic using Dynamic's verification
async function verifyAuthAndGetUser(
  token: string | null
): Promise<{ userId: string; email?: string } | null> {
  if (!token) {
    return null;
  }
  // Example: Decode JWT, verify signature/claims using Dynamic's keys/logic
  // This is a simplified placeholder
  try {
    // Replace with actual JWT verification logic
    const decoded = /* await verifyDynamicToken(token) */ {
      sub: "user_123",
      email: "test@example.com",
    }; // Placeholder
    if (decoded && decoded.sub) {
      return { userId: decoded.sub, email: decoded.email };
    }
    return null;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

// Placeholder function to get or create a Stripe customer ID for your user
// You'll need to store this mapping (yourUserId -> stripeCustomerId) in your database
async function getOrCreateStripeCustomer(
  userId: string,
  email?: string
): Promise<string> {
  // 1. Check your database for an existing Stripe customer ID for this userId
  let stripeCustomerId = /* await db.findStripeCustomerId(userId) */ null; // Placeholder DB lookup

  if (!stripeCustomerId) {
    // 2. If not found, create a new Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        // Link the Stripe customer to your internal user ID
        userId: userId,
      },
    });
    stripeCustomerId = customer.id;
    // 3. Save the new stripeCustomerId in your database associated with the userId
    // await db.saveStripeCustomerId(userId, stripeCustomerId); // Placeholder DB save
    console.log(
      `Created Stripe customer ${stripeCustomerId} for user ${userId}`
    );
  }

  return stripeCustomerId;
}

export async function POST(request: NextRequest) {
  try {
    // Access headers directly from the request object
    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1]; // Assuming "Bearer TOKEN" format

    // 1. Verify authentication
    const user = await verifyAuthAndGetUser(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, quantity = 1 } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // 2. Get or create Stripe Customer ID
    const customerId = await getOrCreateStripeCustomer(user.userId, user.email);

    const YOUR_DOMAIN =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const plans = await stripe.plans.list({
      limit: 3,
    });

    const price = await stripe.prices.list();

    // 3. Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "subscription", // Use 'payment' for one-time payments
      customer: customerId, // Associate checkout with the Stripe Customer
      success_url: `${YOUR_DOMAIN}/marketplace/settings?session_id={CHECKOUT_SESSION_ID}`, // Redirect URL on success
      cancel_url: `${YOUR_DOMAIN}/marketplace/settings`, // Redirect URL on cancellation
      metadata: {
        userId: user.userId, // Add metadata to link session to your user
      },
    });

    // 4. Return the session ID
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

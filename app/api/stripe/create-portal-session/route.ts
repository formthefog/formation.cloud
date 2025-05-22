import { Stripe } from "stripe";
import { NextResponse, NextRequest } from "next/server";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// --- Re-use or adapt these functions from create-checkout-session ---

// Placeholder for verifying the token and getting user data
// Replace with your actual Dynamic token verification logic
async function verifyAuthAndGetUser(
  token: string | null
): Promise<{ userId: string; email?: string } | null> {
  if (!token) return null;
  try {
    // Replace with actual JWT verification
    const decoded = { sub: "user_123", email: "test@example.com" }; // Placeholder
    return decoded && decoded.sub
      ? { userId: decoded.sub, email: decoded.email }
      : null;
  } catch (error) {
    console.error("Auth verification failed:", error);
    return null;
  }
}

// Placeholder for getting the Stripe customer ID from your database
// Ensure this is implemented to retrieve the stored mapping
async function getStripeCustomerId(userId: string): Promise<string | null> {
  // Replace with your actual database lookup
  const stripeCustomerId = /* await db.findStripeCustomerId(userId) */ `cus_${userId}_placeholder`; // Placeholder lookup
  if (!stripeCustomerId) {
    console.error(`Stripe customer ID not found for user ${userId}`);
    return null;
  }
  return stripeCustomerId;
}

// --- API Route Handler ---

export async function POST(request: NextRequest) {
  try {
    const authorization = request.headers.get("Authorization");
    const token = authorization?.split(" ")[1];

    // 1. Verify authentication
    const user = await verifyAuthAndGetUser(token);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Get Stripe Customer ID for the user
    const customerId = await getStripeCustomerId(user.userId);
    if (!customerId) {
      // Handle case where user exists but has no Stripe customer ID yet
      // Maybe they haven't subscribed? Or an error occurred previously.
      // You could prompt them to choose a plan first, or log an error.
      return NextResponse.json(
        { error: "Stripe customer not found for this user." },
        { status: 404 }
      );
    }

    console.log("VERCEL_BRANCH_URL", process.env.VERCEL_BRANCH_URL);

    const YOUR_DOMAIN =
      `https://${process.env.VERCEL_BRANCH_URL}` || "http://localhost:3000";
    const returnUrl = `${YOUR_DOMAIN}/marketplace/settings`; // Where to redirect after portal

    console.log("RETURN URL", returnUrl);

    // 3. Create a Stripe Billing Portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    // 4. Return the portal session URL
    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Error creating portal session:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

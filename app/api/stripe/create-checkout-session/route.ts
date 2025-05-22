import { Stripe } from "stripe";
import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Account } from "@/types/account";

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // apiVersion: '2024-06-20', // Removed explicit API version
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Replace this with your actual authentication logic using Dynamic's verification
async function verifyAuthAndGetUser(
  token: string | null
): Promise<Account | null> {
  if (!token) {
    return null;
  }
  try {
    // TODO: Replace with actual JWT verification logic for Dynamic
    // For now, decode the JWT and extract the dynamic_id (sub)
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    const dynamicId = decoded.sub;
    if (!dynamicId) return null;
    // Fetch the account from Supabase using dynamic_id
    const { data: account, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("dynamic_id", dynamicId)
      .single();
    if (error || !account) {
      console.error("Account not found or error:", error);
      return null;
    }
    return account;
  } catch (error) {
    console.error("Auth verification or account fetch failed:", error);
    return null;
  }
}

// Placeholder function to get or create a Stripe customer ID for your user
// You'll need to store this mapping (yourUserId -> stripeCustomerId) in your database
async function getOrCreateStripeCustomer(
  userId: string,
  email?: string,
  accountId?: string
): Promise<string> {
  // 1. Check your database for an existing Stripe customer ID for this userId
  let stripeCustomerId = /* await db.findStripeCustomerId(userId) */ null; // Placeholder DB lookup

  if (!stripeCustomerId) {
    // 2. If not found, create a new Stripe customer
    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        userId: userId,
        account_id: accountId,
      },
    });
    stripeCustomerId = customer.id;
    // 3. Save the new stripeCustomerId in your database associated with the userId
    // await db.saveStripeCustomerId(userId, stripeCustomerId); // Placeholder DB save
    console.log(
      `Created Stripe customer ${stripeCustomerId} for user ${userId} (account ${accountId})`
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
    const account = await verifyAuthAndGetUser(token);
    if (!account) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, quantity = 1, accountId } = await request.json();

    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // 2. Get or create Stripe Customer ID
    const customerId = await getOrCreateStripeCustomer(
      account.dynamic_id,
      account.email,
      account.id
    );

    const YOUR_DOMAIN =
      `https://${process.env.VERCEL_URL}` || "http://localhost:3000";

    console.log("YOUR_DOMAIN", YOUR_DOMAIN);

    const plans = await stripe.plans.list({
      limit: 3,
    });

    const price = await stripe.prices.list();

    // 3. Determine checkout mode based on priceId
    // 'price_1RBJv7FbFYF5MTmwhoXYqg5E' is the Pay As You Go (credit top-up) priceId
    let mode: "payment" | "subscription" = "subscription";
    let metadata: Record<string, any> = {
      dynamic_id: account.dynamic_id,
      account_id: account.id,
    };
    if (priceId === "price_1RBJv7FbFYF5MTmwhoXYqg5E") {
      mode = "payment";
    }

    // 4. Build session params and conditionally add setup_future_usage
    const sessionParams: any = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode,
      customer: customerId,
      success_url: `${YOUR_DOMAIN}/marketplace/settings?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/marketplace/settings`,
      metadata,
      // Add this to ensure payment methods are attached to customers automatically
    };

    if (mode === "payment") {
      sessionParams.payment_intent_data = {
        setup_future_usage: "off_session",
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // 5. Return the session ID
    return NextResponse.json({ sessionId: session.id });
  } catch (err: any) {
    console.error("Error creating checkout session:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

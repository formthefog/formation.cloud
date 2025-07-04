import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { state, wallet_address } = await request.json();

    // Optionally store state and wallet_address for CSRF protection
    await supabase.from("verification_tokens").insert({
      identifier: wallet_address,
      token: state,
      expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 min expiry
    });

    const redirectUrl = String(process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL);

    console.log("redirectUrl", redirectUrl);

    // Build the GitHub OAuth URL
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      // redirect_uri: process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL!,
      scope: "repo,write:repo_hook",
      state,
    });

    return NextResponse.json({
      url: `https://github.com/apps/formation-deploy/installations/new?${params.toString()}&state=${wallet_address}`,
    });
  } catch (error) {
    console.error("Error generating GitHub auth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate GitHub auth URL" },
      { status: 500 }
    );
  }
}

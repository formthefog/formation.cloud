import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Octokit } from "octokit";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const installationId = searchParams.get("installation_id");

    // Validate required parameters
    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          // If you implemented state parameter for CSRF protection
          state,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error("GitHub OAuth error:", tokenData.error);
      return NextResponse.json(
        { error: "Failed to exchange code for token" },
        { status: 400 }
      );
    }

    const { access_token, refresh_token, expires_in } = tokenData;

    // Get GitHub user information
    const octokit = new Octokit({ auth: access_token });
    const { data: githubUser } = await octokit.rest.users.getAuthenticated();

    // Get the user's session from cookie
    const cookieStore = await cookies();
    const supabaseSessionCookie = cookieStore.get("supabase-auth-token");

    if (!supabaseSessionCookie) {
      return NextResponse.json(
        { error: "No authentication session found" },
        { status: 401 }
      );
    }

    // Parse the session data
    const sessionData = JSON.parse(supabaseSessionCookie.value);
    const userId = sessionData[0].user.id;

    // Find or create account record
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .insert({
        user_id: userId,
        provider: "github",
        provider_account_id: githubUser.id.toString(),
        type: "oauth",
        access_token,
        refresh_token,
        expires_at: expires_in
          ? Math.floor(Date.now() / 1000) + expires_in
          : null,
        token_type: "bearer",
        scope: "repo,write:repo_hook",
        session_state: state || null,
      })
      .select()
      .single();

    if (accountError) {
      // If account already exists, update it
      if (accountError.code === "23505") {
        // Unique constraint violation
        const { data: updatedAccount, error: updateError } = await supabase
          .from("accounts")
          .update({
            access_token,
            refresh_token,
            expires_at: expires_in
              ? Math.floor(Date.now() / 1000) + expires_in
              : null,
            updated_at: new Date().toISOString(),
          })
          .match({
            provider: "github",
            provider_account_id: githubUser.id.toString(),
          })
          .select()
          .single();

        if (updateError) {
          console.error("Error updating account:", updateError);
          return NextResponse.json(
            { error: "Failed to update account" },
            { status: 500 }
          );
        }
      } else {
        console.error("Error creating account:", accountError);
        return NextResponse.json(
          { error: "Failed to create account" },
          { status: 500 }
        );
      }
    }

    // If there's an installation_id, create GitHub integration
    if (installationId) {
      const { error: integrationError } = await supabase
        .from("github_integrations")
        .insert({
          account_id: account?.id,
          installation_id: installationId,
          status: "active",
        });

      if (integrationError) {
        console.error("Error creating integration:", integrationError);
        // Don't return error here, as the OAuth flow is still successful
      }
    }

    // Redirect to success page with installation ID if present
    const redirectUrl = new URL("/marketplace/settings", request.url);
    if (installationId) {
      redirectUrl.searchParams.set("installation_id", installationId);
    }
    redirectUrl.searchParams.set("success", "true");

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("GitHub callback error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

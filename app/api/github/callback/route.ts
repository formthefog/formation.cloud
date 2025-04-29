import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { Octokit, App } from "octokit";
import { createAppAuth } from "@octokit/auth-app";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get("state");
    const installationId = searchParams.get("installation_id");

    const { data: account, error: findError } = await supabase
      .from("accounts")
      .select("*")
      .eq("primary_address", state)
      .single();

    if (findError || !account) {
      return NextResponse.json(
        { error: "No account found for this primary address" },
        { status: 404 }
      );
    }

    console.log("account", account);

    try {
      const { data: existingIntegration } = await supabase
        .from("github_integrations")
        .select("id")
        .eq("account_id", account.id)
        .single();

      // 4. If not, insert it
      if (!existingIntegration) {
        console.log("inserting new integration for account id:", account.id);
        await supabase.from("github_integrations").insert({
          account_id: account.id,
          status: "active",
          repository_name: "test",
          repository_url: "https://github.com/test",
          installation_id: installationId,
          branch: "main",
        });
      }
    } catch (error) {
      console.error("GitHub callback error:", error);
    }

    // Redirect to success page with installation ID if present
    const redirectUrl = new URL("/marketplace/create-agent", request.url);
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

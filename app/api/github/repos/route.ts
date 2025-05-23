import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { githubApp } from "@/lib/github";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("account_id");

    // Get the integration record from Supabase
    const { data: integration, error } = await supabase
      .from("github_integrations")
      .select("account_id, installation_id, status")
      .eq("account_id", accountId)
      .single();

    if (error || !integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }

    const installationId = integration.installation_id;
    if (!installationId) {
      return NextResponse.json(
        { error: "No installation_id found for this account" },
        { status: 400 }
      );
    }

    // Get an Octokit instance authenticated as the installation
    const octokit = await githubApp.getInstallationOctokit(installationId);
    const repos = await octokit.request(
      "GET /installation/repositories?per_page=100",
      {}
    );

    return NextResponse.json({ repositories: repos.data.repositories });
  } catch (err) {
    console.error("Error fetching GitHub repos:", err);
    return NextResponse.json(
      { error: "Failed to fetch repositories" },
      { status: 500 }
    );
  }
}

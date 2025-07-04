import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { Webhooks } from "@octokit/webhooks";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET!,
});

export async function POST(request: Request) {
  const payload = await request.json();
  const signature = request.headers.get("x-hub-signature-256");

  try {
    // Verify webhook signature
    await webhooks.verify(payload, signature!);

    // Find the integration
    const { data: integration, error } = await supabase
      .from("github_integrations")
      .select("*")
      .eq("repository_name", payload.repository.full_name)
      .single();

    if (error || !integration) {
      return NextResponse.json(
        { error: "Integration not found" },
        { status: 404 }
      );
    }

    // Handle push event
    if (payload.ref === `refs/heads/${integration.branch}`) {
      // Create deployment record
      const { data: deployment, error: deployError } = await supabase
        .from("github_deployments")
        .insert({
          integration_id: integration.id,
          commit_sha: payload.after,
          status: "pending",
        })
        .select()
        .single();

      if (deployError) throw deployError;

      // Trigger deployment process (implement based on your deployment strategy)
      await triggerDeployment(deployment.id, payload);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

async function triggerDeployment(deploymentId: string, payload: any) {
  try {
    // Implement your deployment logic here
    // This could involve:
    // 1. Cloning the repository
    // 2. Checking out the specific commit
    // 3. Running build process
    // 4. Deploying to your infrastructure

    // Update deployment status
    await supabase
      .from("github_deployments")
      .update({
        status: "success",
        deployment_url: "https://your-deployment-url.com",
        updated_at: new Date().toISOString(),
      })
      .eq("id", deploymentId);
  } catch (error) {
    console.error("Deployment failed:", error);

    await supabase
      .from("github_deployments")
      .update({
        status: "failure",
        logs: error.message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", deploymentId);
  }
}

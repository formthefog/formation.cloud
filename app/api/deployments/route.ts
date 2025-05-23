import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Needs workflow scope
const REPO_OWNER = "hathbanger";
const REPO_NAME = "formation-agents";
const WORKFLOW_FILE = "deploy-agent.yml"; // or .github/workflows/deploy-agent.yml

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("account_id");
    if (!accountId) {
      return NextResponse.json(
        { error: "account_id is required" },
        { status: 400 }
      );
    }
    const { data, error } = await supabase
      .from("deployments")
      .select("*, agent:agents(*)")
      .eq("account_id", accountId);
    if (error) {
      console.error("Error fetching deployments:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "No deployments found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ deployments: data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching deployments:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch deployments",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.agent_id || !body.account_id) {
      return NextResponse.json(
        { error: "agent_id and account_id are required" },
        { status: 400 }
      );
    }

    // Compose deployment record
    const deploymentRecord: any = {
      agent_id: body.agent_id,
      account_id: body.account_id,
      status: "pending",
      integration_id: body.integration_id || null,
      commit_sha: body.commit_sha || null,
      deployment_url: body.deployment_url || null,
      logs: body.logs || null,
      do_id: body.do_id || null,
      // Add all config fields from the request for extensibility
      config: body.config || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert deployment record
    const { data, error } = await supabase
      .from("deployments")
      .insert([deploymentRecord])
      .select()
      .single();

    if (error) {
      console.error("Error inserting deployment:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const { data: agentData, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("agent_id", data.agent_id)
      .single();

    if (agentError) {
      console.error("Error fetching agent:", agentError);
      return NextResponse.json({ error: agentError.message }, { status: 400 });
    }

    // Try to trigger GitHub Action
    try {
      console.log("data", data);
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({
            ref: "main", // or the branch you want to deploy from
            inputs: {
              app_id: agentData.name.toLowerCase().replace(/ /g, "-"),
              deployment_id: data.id, // from your DB
              agent_id: data.agent_id,
              docker_tag: `${agentData.name.toLowerCase().replace(/ /g, "-")}:latest`,
            },
          }),
        }
      );

      if (!res.ok) {
        const ghError = await res.json();
        // Update deployment status to failed
        await supabase
          .from("deployments")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
            logs: `GitHub Action error: ${ghError.message}`,
          })
          .eq("id", data.id);
        throw new Error(`Failed to trigger GitHub Action: ${ghError.message}`);
      }
    } catch (ghError: any) {
      console.error("Error triggering GitHub Action:", ghError);
      // Already handled above, just return error
      return NextResponse.json(
        {
          error: "Failed to trigger GitHub Action",
          details: ghError.message || ghError,
          deployment: data,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ deployment: data }, { status: 201 });
  } catch (error) {
    console.error("Error creating deployment:", error);
    return NextResponse.json(
      {
        error: "Failed to create deployment",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

// Endpoint to retry failed GitHub Action triggers for a deployment
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { deploymentId } = body;
    if (!deploymentId) {
      return NextResponse.json(
        { error: "deploymentId is required" },
        { status: 400 }
      );
    }

    // Fetch the deployment
    const { data, error } = await supabase
      .from("deployments")
      .select("*")
      .eq("id", deploymentId)
      .single();
    if (error || !data) {
      return NextResponse.json(
        { error: "Deployment not found" },
        { status: 404 }
      );
    }

    const { data: agentData, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("agent_id", data.agent_id)
      .single();

    if (agentError) {
      console.error("Error fetching agent:", agentError);
      return NextResponse.json({ error: agentError.message }, { status: 400 });
    }

    // Try to trigger GitHub Action again
    try {
      const res = await fetch(
        `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github+json",
          },
          body: JSON.stringify({
            ref: "main",
            inputs: {
              app_id: agentData.name.toLowerCase().replace(/ /g, "-"),
              deployment_id: data.id,
              agent_id: data.agent_id,
              docker_tag: `${agentData.name.toLowerCase().replace(/ /g, "-")}:latest`,
            },
          }),
        }
      );
      if (!res.ok) {
        const ghError = await res.json();
        // Update deployment status to failed
        await supabase
          .from("deployments")
          .update({
            status: "failed",
            updated_at: new Date().toISOString(),
            logs: `GitHub Action error: ${ghError.message}`,
          })
          .eq("id", data.id);
        throw new Error(`Failed to trigger GitHub Action: ${ghError.message}`);
      }
      // If successful, update status to pending (or running, as appropriate)
      await supabase
        .from("deployments")
        .update({ status: "pending", updated_at: new Date().toISOString() })
        .eq("id", data.id);
      return NextResponse.json({ success: true, deploymentId: data.id });
    } catch (ghError: any) {
      return NextResponse.json(
        {
          error: "Failed to re-trigger GitHub Action",
          details: ghError.message || ghError,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to retry GitHub Action trigger",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

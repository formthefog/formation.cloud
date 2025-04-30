import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ deployment: data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to create deployment",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

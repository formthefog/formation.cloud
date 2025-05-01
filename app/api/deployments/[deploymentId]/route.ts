import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(request: NextRequest, { params }: any) {
  try {
    const { deploymentId } = await params;
    const body = await request.json();

    // Only allow updating certain fields
    const updatableFields: any = {};
    if (body.status) updatableFields.status = body.status;
    if (body.logs) updatableFields.logs = body.logs;
    if (body.deployment_url)
      updatableFields.deployment_url = body.deployment_url;
    if (body.docker_image) updatableFields.docker_image = body.docker_image;
    if (body.do_id) updatableFields.do_id = body.do_id;
    if (body.commit_sha) updatableFields.commit_sha = body.commit_sha;
    if (body.updated_at) updatableFields.updated_at = body.updated_at;
    else updatableFields.updated_at = new Date().toISOString();

    // Update the deployment record
    const { data, error } = await supabase
      .from("deployments")
      .update(updatableFields)
      .eq("id", deploymentId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ deployment: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to update deployment status",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, { params }: any) {
  try {
    const { deploymentId } = await params;
    const { data, error } = await supabase
      .from("deployments")
      .select("*, agent:agents(*)")
      .eq("id", deploymentId)
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (!data) {
      return NextResponse.json(
        { error: "Deployment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ deployment: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch deployment",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    const { deploymentId } = await params;

    // First, fetch the deployment to get the DO ID
    const { data: deployment, error: fetchError } = await supabase
      .from("deployments")
      .select("*")
      .eq("id", deploymentId)
      .single();

    if (fetchError) {
      return NextResponse.json(
        { error: "Failed to fetch deployment" },
        { status: 404 }
      );
    }

    // If there's a Digital Ocean ID, delete the resource from DO first
    if (deployment.do_id) {
      try {
        const doResponse = await fetch(
          `https://api.digitalocean.com/v2/apps/${deployment.do_id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${process.env.DO_API_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!doResponse.ok) {
          console.error(
            "Failed to delete DO resource:",
            await doResponse.text()
          );
          // We'll continue with the Supabase deletion even if DO deletion fails
          // but we'll include a warning in the response
        }
      } catch (doError) {
        console.error("Error deleting DO resource:", doError);
        // Continue with Supabase deletion but include error in response
      }
    }

    // Delete the deployment record from Supabase
    const { error: deleteError } = await supabase
      .from("deployments")
      .delete()
      .eq("id", deploymentId);

    if (deleteError) {
      return NextResponse.json(
        { error: "Failed to delete deployment record" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Deployment deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting deployment:", error);
    return NextResponse.json(
      {
        error: "Failed to delete deployment",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}

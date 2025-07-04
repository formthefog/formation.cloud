import { Agent } from "@/types/agent";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import supabase from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ agentId: string }> }
) {
  const { agentId } = await params;

  try {
    // Try to fetch by agent_id first
    let { data: agents, error } = await supabase
      .from("agents")
      .select("*")
      .or(`agent_id.eq.${agentId},name.eq.${agentId.replace(/-/g, " ")}`);

    if (error) {
      throw new Error(error.message);
    }

    // Fallback: try to match by kebab-case name if not found by agent_id
    let agent = (agents as Agent[] | null)?.find(
      (a) =>
        String(a.agent_id) === String(agentId) ||
        a.name?.toLowerCase().replace(/\s+/g, "-") === agentId.toLowerCase()
    );

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ Success: agent });
  } catch (error) {
    console.error("Error fetching agent details from Supabase:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch agent details",
      },
      { status: 500 }
    );
  }
}

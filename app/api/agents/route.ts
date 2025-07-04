import { NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { Agent } from "@/types/agent";

export async function GET(request: Request) {
  try {
    // Get URL search parameters
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    // Extract query parameters for filtering
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const featured = searchParams.get("featured");
    const isPrivate = searchParams.get("isPrivate");
    const ownerId = searchParams.get("ownerId");
    const tags = searchParams.get("tags")?.split(",");
    const capabilities = searchParams.get("capabilities")?.split(",");
    const agentType = searchParams.get("agentType");
    const sortBy = searchParams.get("sortBy") || "created_at";
    const sortOrder = (
      searchParams.get("sortOrder") || "desc"
    ).toUpperCase() as "ASC" | "DESC";
    const search = searchParams.get("search");

    // Start building the query
    let query = supabase.from("agents").select("*", { count: "exact" });

    // Apply filters if provided
    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    if (isPrivate === "true" || isPrivate === "false") {
      query = query.eq("is_private", isPrivate === "true");
    }

    if (ownerId) {
      query = query.eq("owner_id", ownerId);
    }

    if (agentType) {
      query = query.eq("agent_type", agentType);
    }

    if (tags && tags.length > 0) {
      query = query.overlaps("tags", tags);
    }

    if (capabilities && capabilities.length > 0) {
      query = query.overlaps("capabilities", capabilities);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting and pagination
    const { data, error, count } = await query
      .order(sortBy, { ascending: sortOrder === "ASC" })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    // Return data with pagination metadata
    return NextResponse.json({
      agents: data as Agent[],
      pagination: {
        total: count,
        limit,
        offset,
        hasMore: count ? offset + limit < count : false,
      },
    });
  } catch (error) {
    console.error("Error fetching agents from Supabase:", error);
    return NextResponse.json(
      { error: "Failed to fetch agents", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Add POST method to create new agents
export async function POST(request: Request) {
  try {
    const agentData = await request.json();

    // Validate required fields
    if (!agentData.name || !agentData.owner_id) {
      return NextResponse.json(
        { error: "Name and owner_id are required fields" },
        { status: 400 }
      );
    }

    // if (true) {
    //   return NextResponse.json(
    //     { error: "You are not authorized to create an agent" },
    //     { status: 401 }
    //   );
    // }

    // Insert new agent
    const { data, error } = await supabase
      .from("agents")
      .insert(agentData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(data as Agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent in Supabase:", error);
    return NextResponse.json(
      { error: "Failed to create agent", details: (error as Error).message },
      { status: 500 }
    );
  }
}

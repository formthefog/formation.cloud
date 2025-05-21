import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request: NextRequest) {
  try {
    // Extract the token from the authorization header
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { error: "Authorization header is required" },
        { status: 401 }
      );
    }

    // Get the request body
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.address) {
      console.log("Missing required fields", body);
      return NextResponse.json(
        { error: "user_id, email, and address are required" },
        { status: 400 }
      );
    }

    const foundAccount = await supabase
      .from("accounts")
      .select("*")
      .eq("dynamic_id", body.dynamic_id)
      .single();

    if (!foundAccount.error) {
      console.log("Account already exists", foundAccount);
      return NextResponse.json(
        { message: "Already exists. All good." },
        { status: 200 }
      );
    }

    // Insert new account record into 'accounts' table, attributed to user_id
    const { data, error } = await supabase
      .from("accounts")
      .insert([
        {
          dynamic_id: body.dynamic_id,
          primary_address: body.address,
          created_at: new Date().toISOString(),
          access_token: body.access_token,
          refresh_token: body.refresh_token,
          expires_at: body.expires_at,
          token_type: body.token_type,
          scope: body.scope,
        },
      ])
      .select()
      .single();

    if (error) {
      console.log("Error in account creation", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in account creation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

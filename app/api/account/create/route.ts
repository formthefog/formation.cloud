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
    if (!body.user_id || !body.email || !body.address) {
      return NextResponse.json(
        { error: "user_id, email, and address are required" },
        { status: 400 }
      );
    }

    // Upsert user in 'users' table
    const { error: userError } = await supabase.from("users").upsert(
      [
        {
          id: body.user_id,
          email: body.email,
          name: body.name || null,
        },
      ],
      { onConflict: "id" }
    );

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 });
    }

    // Insert new account record into 'accounts' table, attributed to user_id
    const { data, error } = await supabase
      .from("accounts")
      .insert([
        {
          user_id: body.user_id,
          primary_address: body.address,
          created_at: new Date().toISOString(),
          type: "oauth",
          provider: "github",
          provider_account_id: body.provider_account_id,
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
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Return the created account data
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error in account creation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

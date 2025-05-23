import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyDynamicJWT } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }
    const userData = await verifyDynamicJWT(token);
    if (!userData || !userData.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    // Find the user by sub (Dynamic.xyz user id)
    const { data: user, error: userError } = await supabase
      .from("accounts")
      .select("*")
      .eq("dynamic_id", userData.sub)
      .single();
    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Find all accounts for this user
    const { data: accounts, error: accountsError } = await supabase
      .from("accounts")
      .select("*")
      .eq("dynamic_id", userData.sub);
    if (accountsError) {
      return NextResponse.json(
        { error: "Accounts not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.error("Error fetching accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch accounts" },
      { status: 500 }
    );
  }
}

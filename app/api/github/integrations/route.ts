import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyDynamicJWT } from "@/lib/auth";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  try {
    // Verify Dynamic.xyz JWT token
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const userData = await verifyDynamicJWT(token);
    if (!userData || !userData.sub) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // 1. Find the user by sub (Dynamic.xyz user id)
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userData.sub)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Find all accounts for this user
    const { data: accounts, error: accountsError } = await supabase
      .from("accounts")
      .select("id")
      .eq("user_id", user.id);

    if (accountsError) {
      return NextResponse.json(
        { error: "Accounts not found" },
        { status: 404 }
      );
    }

    const accountIds = accounts.map((a: { id: string }) => a.id);

    if (accountIds.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // 3. Get all github_integrations for these accounts
    const { data, error } = await supabase
      .from("github_integrations")
      .select("*")
      .in("account_id", accountIds)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching GitHub integrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch integrations" },
      { status: 500 }
    );
  }
}

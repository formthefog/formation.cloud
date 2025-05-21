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

    // 2. Find all accounts for this user
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("id")
      .eq("dynamic_id", userData.sub)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const accountId = account.id;

    if (!accountId) {
      return NextResponse.json([], { status: 200 });
    }

    // 3. Get all github_integrations for these accounts
    const { data, error } = await supabase
      .from("github_integrations")
      .select("*")
      .eq("account_id", accountId)
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

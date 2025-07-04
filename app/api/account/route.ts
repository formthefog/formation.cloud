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
    const { data: account, error: accountError } = await supabase
      .from("accounts")
      .select("*")
      .eq("dynamic_id", userData.sub)
      .single();
    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json(account, { status: 200 });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      { error: "Failed to fetch account" },
      { status: 500 }
    );
  }
}

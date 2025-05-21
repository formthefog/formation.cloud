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
      .select("auto_topup_threshold, auto_topup_amount")
      .eq("dynamic_id", userData.sub)
      .single();
    if (accountError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        threshold: account.auto_topup_threshold,
        amount: account.auto_topup_amount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching auto-topup settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch auto-topup settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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
    const { threshold, amount } = await request.json();
    const { error: updateError } = await supabase
      .from("accounts")
      .update({
        auto_topup_threshold: threshold,
        auto_topup_amount: amount,
      })
      .eq("dynamic_id", userData.sub);
    if (updateError) {
      return NextResponse.json(
        { success: false, error: "Failed to update auto-topup settings" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating auto-topup settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update auto-topup settings" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

export async function GET() {
  const { user, supabase, unauthorized } = await getAuthenticatedUser();
  if (!user) {
    return unauthorized;
  }

  const { data, error } = await supabase
    .from("jobs")
    .select("id,user_id,actor_id,status,run_id,lead_count,message,created_at")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Unable to load jobs." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data });
}

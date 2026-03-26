import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

export async function GET() {
  const { user, supabase, unauthorized } = await getAuthenticatedUser();
  if (!user) {
    return unauthorized;
  }

  const { data, error } = await supabase
    .from("leads")
    .select("id,user_id,name,email,company,source,email_status,last_contacted_at,created_at")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) {
    return NextResponse.json(
      { success: false, message: "Unable to load leads." },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data });
}

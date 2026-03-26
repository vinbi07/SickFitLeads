import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardLayout userEmail={user.email ?? "Signed user"}>
      <DashboardClient userEmail={user.email ?? "Signed user"} />
    </DashboardLayout>
  );
}

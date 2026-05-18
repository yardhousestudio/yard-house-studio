import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminUser = {
  id: string;
  email: string;
};

// Server-only gate. Returns the signed-in admin, or redirects:
// - not signed in        -> /login
// - signed in, not admin -> /login?error=forbidden
export async function requireAdmin(): Promise<AdminUser> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/login?error=forbidden");

  return { id: user.id, email: user.email ?? "" };
}

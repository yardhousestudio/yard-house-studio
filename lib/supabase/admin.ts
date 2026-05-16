import "server-only";
import { createClient } from "@supabase/supabase-js";

// Service-role client — bypasses RLS. Server-only. Use sparingly:
// seeding, storage operations as a system actor, scripts.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: { autoRefreshToken: false, persistSession: false },
    },
  );
}

import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Run on admin + auth routes; skip static assets and the public site.
  matcher: ["/admin/:path*", "/login", "/auth/:path*"],
};

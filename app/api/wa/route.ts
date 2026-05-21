import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  interpolateVariables,
  variablesFromRows,
} from "@/lib/interpolateVariables";
import {
  getWhatsAppSettings,
} from "@/lib/whatsapp.server";
import {
  hasWhatsAppNumber,
  resolveWhatsAppNumber,
} from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

function isSameOrigin(request: NextRequest): boolean {
  const referrer =
    request.headers.get("origin") ?? request.headers.get("referer");
  if (!referrer) return false;
  try {
    return new URL(referrer).origin === request.nextUrl.origin;
  } catch {
    return false;
  }
}

function plain(status: number, body: string): NextResponse {
  return new NextResponse(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}

export async function GET(request: NextRequest) {
  const routeId = request.nextUrl.searchParams.get("route");
  if (!routeId?.trim()) {
    return plain(400, "Invalid route.");
  }
  if (!isSameOrigin(request)) {
    return plain(403, "Forbidden.");
  }

  const settings = await getWhatsAppSettings();
  if (!hasWhatsAppNumber(settings)) {
    return plain(
      503,
      "WhatsApp contact isn't set up yet. Please get in touch by email.",
    );
  }

  const option = settings.modal_options.find((o) => o.id === routeId);
  if (!option) {
    return plain(400, "Invalid route.");
  }

  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("site_variables")
    .select("key, value")
    .not("key", "ilike", "WHATSAPP_%");

  const vars = variablesFromRows(rows ?? []);
  const message = interpolateVariables(option.message, vars);
  const number = resolveWhatsAppNumber(settings);

  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  const response = NextResponse.redirect(url, 302);
  response.headers.set("Cache-Control", "no-store, must-revalidate");
  return response;
}

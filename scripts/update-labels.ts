/**
 * One-off: strip the "NN — " number prefix from section labels on the
 * homepage's components (e.g. "01 — Services" -> "Services").
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const PREFIX = /^\s*\d+\s*[—–-]\s*/;

async function main() {
  const { data: page, error } = await supabase
    .from("pages")
    .select("id, components")
    .eq("is_homepage", true)
    .single();
  if (error) throw error;
  if (!page) throw new Error("Homepage not found");

  const components = page.components as Array<{
    type: string;
    props: Record<string, unknown>;
  }>;

  let changed = 0;
  for (const c of components) {
    const label = c.props.label;
    if (typeof label === "string" && PREFIX.test(label)) {
      const next = label.replace(PREFIX, "");
      console.log(`  ${c.type}: "${label}" -> "${next}"`);
      c.props.label = next;
      changed++;
    }
  }

  if (changed === 0) {
    console.log("No numbered labels found — nothing to do.");
    return;
  }

  const { error: updErr } = await supabase
    .from("pages")
    .update({ components })
    .eq("id", page.id);
  if (updErr) throw updErr;

  console.log(`✓ Updated ${changed} label(s).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

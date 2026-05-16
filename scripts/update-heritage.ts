/**
 * One-off: update the Heritage (image-text-split) block's title + body
 * on the homepage.
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

const TITLE = "Where Yard House began.";
const BODY = [
  "The name Yard House comes from our home in the Stockbridge Colonies, built on the site of the original builders’ yard used to construct the colonies themselves.",
  "That renovation was our first true lesson in sensitive property work: a full flat refurbishment shaped by Grade B listing constraints, conservation rules, and the quirks that come with old Edinburgh buildings.",
  "Lath and plaster. Limestone walls. Period detailing. Legacy services hidden where you least expect them.",
  "These homes aren’t generic. Whether it’s your family home or part of your portfolio, getting the details right matters.",
  "We bring a premium eye, practical judgement, and trusted trades, without the inflated price tag.",
].join("\n\n");

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
  const block = components.find((c) => c.type === "image-text-split");
  if (!block) throw new Error("image-text-split block not found");

  block.props.title = TITLE;
  block.props.body = BODY;

  const { error: updErr } = await supabase
    .from("pages")
    .update({ components })
    .eq("id", page.id);
  if (updErr) throw updErr;

  console.log("✓ Heritage section updated (title + body).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

/**
 * Upload a single image to Supabase Storage `media` bucket and wire it into
 * the homepage's hero block. One-off Stage A helper until Stage B's media
 * library is built.
 *
 * Usage: npx tsx scripts/upload-image.ts <source-path> [block-type]
 *   block-type defaults to "hero-image-text".
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing Supabase env vars in .env.local");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const [, , sourcePathArg, blockTypeArg] = process.argv;
const sourcePath = sourcePathArg;
const blockType = blockTypeArg ?? "hero-image-text";

if (!sourcePath) {
  console.error("Usage: npx tsx scripts/upload-image.ts <source-path> [block-type]");
  process.exit(1);
}

function mimeFromName(name: string): string {
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".avif")) return "image/avif";
  if (lower.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

async function main() {
  const filename = basename(sourcePath);
  const mime = mimeFromName(filename);

  console.log(`→ Reading ${sourcePath}…`);
  const stats = await stat(sourcePath);
  const buffer = await readFile(sourcePath);
  console.log(`  ${stats.size.toLocaleString()} bytes, ${mime}`);

  console.log(`→ Uploading to Supabase Storage as media/${filename}…`);
  const { error: upErr } = await supabase.storage
    .from("media")
    .upload(filename, buffer, { contentType: mime, upsert: true });
  if (upErr) throw upErr;

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(filename);
  console.log(`✓ Public URL: ${publicUrl}`);

  console.log("→ Recording row in media table…");
  await supabase.from("media").delete().eq("storage_path", filename);
  const { error: mediaErr } = await supabase.from("media").insert({
    storage_path: filename,
    filename,
    mime_type: mime,
    size_bytes: stats.size,
  });
  if (mediaErr) throw mediaErr;

  console.log(`→ Wiring into homepage block "${blockType}"…`);
  const { data: page, error: pageErr } = await supabase
    .from("pages")
    .select("id, components, og_image")
    .eq("is_homepage", true)
    .single();
  if (pageErr) throw pageErr;
  if (!page) throw new Error("Homepage not found");

  const components = page.components as Array<{
    type: string;
    props: Record<string, unknown>;
  }>;
  const target = components.find((c) => c.type === blockType);
  if (!target) throw new Error(`Block "${blockType}" not on homepage`);

  target.props.image = publicUrl;

  // Update og_image too if this was the hero.
  const updates: { components: unknown; og_image?: string } = { components };
  if (blockType === "hero-image-text") updates.og_image = publicUrl;

  const { error: updErr } = await supabase
    .from("pages")
    .update(updates)
    .eq("id", page.id);
  if (updErr) throw updErr;

  console.log("✓ Homepage updated. Reload http://localhost:3000 to see it.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

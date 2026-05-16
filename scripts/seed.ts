import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { componentSchemas } from "../app/admin/components/componentSchemas";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Placeholder image URLs — Stage B media library will replace these.
// Picsum seeds give us stable, free placeholder photos for the seed.
const HERO_IMAGE = "https://picsum.photos/seed/yardhouse-hero/1600/900";
const HERITAGE_IMAGE =
  "https://picsum.photos/seed/yardhouse-heritage/1200/960";

type SeedComponent = {
  type: string;
  order: number;
  contentKey: string;
  props: Record<string, unknown>;
  anchorId: string;
};

function buildHomepageComponents(): SeedComponent[] {
  const blocks: Array<
    [string, string, Record<string, unknown>?]
  > = [
    ["site-header", "header", {}],
    [
      "hero-image-text",
      "hero",
      { image: HERO_IMAGE },
    ],
    ["divider", "div-1", {}],
    ["services-three-column", "services", {}],
    ["dark-two-column", "about", {}],
    [
      "image-text-split",
      "heritage",
      { image: HERITAGE_IMAGE },
    ],
    ["divider", "div-2", {}],
    ["centered-contact", "contact", {}],
    ["site-footer", "footer", {}],
  ];

  return blocks.map(([type, contentKey, overrides], index) => {
    const schema = componentSchemas[type];
    if (!schema) throw new Error(`Unknown component type: ${type}`);
    const props = { ...schema.defaults, ...(overrides ?? {}) };
    const anchorId =
      typeof props.anchor === "string" && props.anchor
        ? props.anchor
        : contentKey;
    return {
      type,
      order: index,
      contentKey,
      props,
      anchorId,
    };
  });
}

async function main() {
  console.log("→ Seeding variable category…");
  const { data: cat, error: catErr } = await supabase
    .from("variable_categories")
    .upsert({ name: "Business", order: 0 }, { onConflict: "name" })
    .select()
    .single();
  if (catErr) throw catErr;

  console.log("→ Seeding site variables…");
  const variables = [
    { key: "SUPPORT_EMAIL", value: "hello@yardhousestudio.co.uk" },
    { key: "PHONE", value: "+44 (0) 7XXX XXX XXX" },
    { key: "SITE_URL", value: "yardhousestudio.co.uk" },
    { key: "LOCATION", value: "Edinburgh, Scotland" },
  ];
  const { error: varsErr } = await supabase
    .from("site_variables")
    .upsert(
      variables.map((v) => ({ ...v, category_id: cat.id })),
      { onConflict: "key" },
    );
  if (varsErr) throw varsErr;

  console.log("→ Seeding navbar…");
  const { error: navErr } = await supabase.from("navbar").upsert(
    {
      id: 1,
      logo: { text: "Yard House Studio", href: "/" },
      links: [
        { label: "Services", href: "#services", order: 0 },
        { label: "About", href: "#about", order: 1 },
        { label: "Contact", href: "#contact", order: 2 },
      ],
      cta_button: null,
    },
    { onConflict: "id" },
  );
  if (navErr) throw navErr;

  console.log("→ Seeding homepage…");
  const components = buildHomepageComponents();
  const { error: pageErr } = await supabase.from("pages").upsert(
    {
      slug: "",
      title: "Yard House Studio — Thoughtful Property Improvement",
      description:
        "A premium Edinburgh studio combining practical hands-on capability with strong spatial judgement, taste, and sensitivity to period homes.",
      og_title: "Yard House Studio — Thoughtful Property Improvement",
      og_description:
        "A premium Edinburgh studio combining practical hands-on capability with strong spatial judgement, taste, and sensitivity to period homes.",
      og_image: HERO_IMAGE,
      components,
      published: true,
      is_homepage: true,
    },
    { onConflict: "slug" },
  );
  if (pageErr) throw pageErr;

  console.log("✓ Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

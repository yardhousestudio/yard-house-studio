"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ComponentSchema = z.object({
  type: z.string().min(1),
  order: z.number(),
  contentKey: z.string().min(1),
  props: z.record(z.string(), z.unknown()),
  anchorId: z.string(),
});

const ComponentsSchema = z.array(ComponentSchema);

const CreatePageSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z
    .string()
    .regex(
      /^[a-z0-9][a-z0-9/-]*$/,
      "Slug: lowercase letters, numbers, hyphens and slashes (e.g. our-services)",
    ),
});

// Create a new (unpublished) page, scaffolded with a header, a page hero
// and a footer. Returns the new page id so the caller can open its editor.
export async function createPage(input: unknown) {
  const { title, slug } = CreatePageSchema.parse(input);
  const supabase = await createClient();

  const scaffold = ["site-header", "page-hero", "site-footer"].map(
    (type, order) => ({
      type,
      order,
      contentKey: crypto.randomUUID(),
      props: {},
      anchorId: "",
    }),
  );

  const { data, error } = await supabase
    .from("pages")
    .insert({
      title,
      slug,
      components: scaffold,
      published: false,
      is_homepage: false,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error(`A page with the slug "${slug}" already exists.`);
    }
    throw error; // RLS rejects non-admins
  }
  return data.id as string;
}

const SLUG_RE = /^[a-z0-9][a-z0-9/-]*$/;

const PageDetailsSchema = z.object({
  title: z.string().min(1, "Page title is required"),
  slug: z.string(),
  description: z.string(),
  ogTitle: z.string(),
  ogDescription: z.string(),
  ogImage: z.string(),
});

// Save a page's details — title, slug and SEO/Open Graph fields. These are
// plain columns (not part of the component draft), so this writes live at
// once, independent of the draft → publish flow.
export async function savePageDetails(pageId: string, input: unknown) {
  const d = PageDetailsSchema.parse(input);
  const supabase = await createClient();

  const { data: page, error: fetchErr } = await supabase
    .from("pages")
    .select("is_homepage, slug")
    .eq("id", pageId)
    .single();
  if (fetchErr) throw fetchErr;

  // The homepage always lives at the site root — its slug stays empty.
  const slug = page.is_homepage ? "" : d.slug.trim();
  if (!page.is_homepage && !SLUG_RE.test(slug)) {
    throw new Error(
      "Slug: lowercase letters, numbers, hyphens and slashes (e.g. our-services)",
    );
  }

  const { error } = await supabase
    .from("pages")
    .update({
      title: d.title,
      slug,
      description: d.description.trim() || null,
      og_title: d.ogTitle.trim() || null,
      og_description: d.ogDescription.trim() || null,
      og_image: d.ogImage.trim() || null,
    })
    .eq("id", pageId);

  if (error) {
    if (error.code === "23505") {
      throw new Error(`A page with the slug "${slug}" already exists.`);
    }
    throw error; // RLS rejects non-admins
  }

  // Refresh the public page — and its old path too if the slug changed.
  revalidatePath("/" + slug);
  if ((page.slug ?? "") !== slug) revalidatePath("/" + (page.slug ?? ""));
}

// Save the working set of components to the page's draft.
export async function saveDraft(pageId: string, components: unknown) {
  const parsed = ComponentsSchema.parse(components);
  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ draft_components: parsed, has_draft: true })
    .eq("id", pageId);
  if (error) throw error; // RLS rejects non-admins automatically
}

// Promote the draft to live and refresh the public page.
export async function publishDraft(pageId: string) {
  const supabase = await createClient();
  const { data: page, error: fetchErr } = await supabase
    .from("pages")
    .select("draft_components, slug")
    .eq("id", pageId)
    .single();
  if (fetchErr) throw fetchErr;
  if (!page?.draft_components) throw new Error("No draft to publish");

  const { error } = await supabase
    .from("pages")
    .update({
      components: page.draft_components,
      draft_components: null,
      has_draft: false,
      published: true,
    })
    .eq("id", pageId);
  if (error) throw error;

  revalidatePath("/" + (page.slug ?? ""));
}

// Throw the draft away, keeping the live components untouched.
export async function discardDraft(pageId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("pages")
    .update({ draft_components: null, has_draft: false })
    .eq("id", pageId);
  if (error) throw error;
}

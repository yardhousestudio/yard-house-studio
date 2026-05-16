import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { DynamicComponentRenderer } from "@/components/DynamicComponentRenderer";
import type { ComponentInstance } from "@/lib/types";

export const revalidate = false;
export const dynamicParams = true;

type PageRecord = {
  title: string;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  components: ComponentInstance[];
};

function joinSlug(parts: string[] | undefined): string {
  return parts?.join("/") ?? "";
}

export async function generateStaticParams() {
  // Cookie-free client — generateStaticParams runs at build time, no request context.
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  const { data } = await supabase
    .from("pages")
    .select("slug")
    .eq("published", true);

  return (data ?? []).map((p) => ({
    slug: p.slug ? p.slug.split("/").filter(Boolean) : [],
  }));
}

type SlugParams = { slug?: string[] };

export async function generateMetadata(
  props: { params: Promise<SlugParams> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const path = joinSlug(slug);
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("title, og_title, og_description, og_image, description")
    .eq("slug", path)
    .eq("published", true)
    .single();

  if (!data) return {};

  return {
    title: data.og_title ?? data.title,
    description: data.og_description ?? data.description ?? undefined,
    openGraph: {
      title: data.og_title ?? data.title,
      description: data.og_description ?? data.description ?? undefined,
      images: data.og_image ? [data.og_image] : [],
    },
  };
}

export default async function Page(props: { params: Promise<SlugParams> }) {
  const { slug } = await props.params;
  const path = joinSlug(slug);
  const supabase = await createClient();

  const [{ data: page }, { data: variables }] = await Promise.all([
    supabase
      .from("pages")
      .select(
        "title, description, og_title, og_description, og_image, components",
      )
      .eq("slug", path)
      .eq("published", true)
      .single<PageRecord>(),
    supabase.from("site_variables").select("key, value"),
  ]);

  if (!page) notFound();

  return (
    <main className="mx-auto max-w-content bg-page">
      <DynamicComponentRenderer
        components={page.components}
        variables={variables ?? []}
      />
    </main>
  );
}

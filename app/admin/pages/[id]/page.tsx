import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageEditor } from "@/components/admin/PageEditor";
import { PageDetailsEditor } from "@/components/admin/PageDetailsEditor";
import type { ComponentInstance } from "@/lib/types";

type PageRecord = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  is_homepage: boolean;
  components: ComponentInstance[];
  draft_components: ComponentInstance[] | null;
  has_draft: boolean;
};

export default async function EditPageRoute(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const { data: page } = await supabase
    .from("pages")
    .select(
      "id, title, slug, description, og_title, og_description, og_image, is_homepage, components, draft_components, has_draft",
    )
    .eq("id", id)
    .single<PageRecord>();

  if (!page) notFound();

  const editing =
    page.has_draft && page.draft_components
      ? page.draft_components
      : page.components;

  return (
    <div>
      <Link
        href="/admin/pages"
        className="font-body text-small text-ink-secondary hover:text-ink underline underline-offset-4"
      >
        ← All pages
      </Link>
      <div className="mt-4 flex flex-col gap-6">
        <PageDetailsEditor
          pageId={page.id}
          isHomepage={page.is_homepage}
          initial={{
            title: page.title,
            slug: page.slug,
            description: page.description ?? "",
            ogTitle: page.og_title ?? "",
            ogDescription: page.og_description ?? "",
            ogImage: page.og_image ?? "",
          }}
        />
        <PageEditor
          pageId={page.id}
          pageTitle={page.title}
          initialComponents={editing}
          initialHasDraft={page.has_draft}
        />
      </div>
    </div>
  );
}

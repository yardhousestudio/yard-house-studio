import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { PageEditor } from "@/components/admin/PageEditor";
import type { ComponentInstance } from "@/lib/types";

type PageRecord = {
  id: string;
  title: string;
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
    .select("id, title, components, draft_components, has_draft")
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
      <div className="mt-4">
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

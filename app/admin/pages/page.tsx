import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-body text-label uppercase tracking-[0.05em] text-ink-2 border border-divider rounded px-2 py-0.5">
      {children}
    </span>
  );
}

export default async function PagesListPage() {
  const supabase = await createClient();
  const { data: pages } = await supabase
    .from("pages")
    .select("id, title, slug, published, has_draft, is_homepage")
    .order("is_homepage", { ascending: false })
    .order("title");

  return (
    <div>
      <h1 className="font-display text-section text-ink">Pages</h1>
      <p className="font-body text-small text-ink-2 mt-1">
        Select a page to edit its components.
      </p>
      <div className="flex flex-col gap-2 mt-6">
        {(pages ?? []).map((p) => (
          <Link
            key={p.id}
            href={`/admin/pages/${p.id}`}
            className="border border-divider rounded-lg bg-page px-4 py-3 flex items-center justify-between gap-4 hover:border-ink transition-colors"
          >
            <div className="flex items-baseline gap-2">
              <span className="font-body text-body font-medium text-ink">
                {p.title}
              </span>
              <span className="font-body text-small text-ink-2">
                /{p.slug}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {p.is_homepage && <Tag>Homepage</Tag>}
              {p.has_draft && <Tag>Draft</Tag>}
              <Tag>{p.published ? "Published" : "Unpublished"}</Tag>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

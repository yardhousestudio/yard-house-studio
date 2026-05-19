import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewPageForm } from "@/components/admin/NewPageForm";

type PageRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  has_draft: boolean;
  is_homepage: boolean;
  components: unknown[];
  updated_at: string;
};

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left font-body text-label uppercase tracking-[0.05em] text-ink-secondary px-4 py-3">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td className="font-body text-small text-ink-secondary px-4 py-3 align-middle">
      {children}
    </td>
  );
}

export default async function PagesListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select(
      "id, title, slug, published, has_draft, is_homepage, components, updated_at",
    )
    .order("is_homepage", { ascending: false })
    .order("title");
  const pages = (data ?? []) as PageRow[];

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-section text-ink">Pages</h1>
          <p className="font-body text-small text-ink-secondary mt-1">
            Manage your website pages and content.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <NewPageForm />
      </div>

      <div className="mt-4 border border-divider rounded-lg overflow-hidden bg-page">
        <table className="w-full">
          <thead>
            <tr className="border-b border-divider bg-surface">
              <Th>Title</Th>
              <Th>Slug</Th>
              <Th>Status</Th>
              <Th>Draft</Th>
              <Th>Components</Th>
              <Th>Updated</Th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => (
              <tr
                key={p.id}
                className="border-b border-divider last:border-0 hover:bg-surface transition-colors"
              >
                <Td>
                  <Link
                    href={`/admin/pages/${p.id}`}
                    className="font-medium text-ink hover:underline underline-offset-4"
                  >
                    {p.is_homepage ? "⌂ " : ""}
                    {p.title}
                  </Link>
                </Td>
                <Td>
                  <span className="bg-surface border border-divider rounded px-1.5 py-0.5">
                    /{p.slug}
                  </span>
                </Td>
                <Td>{p.published ? "Published" : "Unpublished"}</Td>
                <Td>{p.has_draft ? "Draft" : "—"}</Td>
                <Td>
                  {Array.isArray(p.components) ? p.components.length : 0}{" "}
                  components
                </Td>
                <Td>
                  {new Date(p.updated_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

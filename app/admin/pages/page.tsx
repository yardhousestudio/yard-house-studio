import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NewPageForm } from "@/components/admin/NewPageForm";

type PageType = "standard" | "pillar" | "cluster";

type PageRow = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  has_draft: boolean;
  is_homepage: boolean;
  page_type: PageType;
  components: unknown[];
  updated_at: string;
};

const TABS: { type: PageType; label: string; blurb: string }[] = [
  {
    type: "standard",
    label: "Standard Pages",
    blurb: "Ordinary pages — not part of the pillar/cluster SEO model.",
  },
  {
    type: "pillar",
    label: "Pillar Pages",
    blurb:
      "Broad topic hub pages. Each gathers a set of cluster pages that link back to it.",
  },
  {
    type: "cluster",
    label: "Cluster Pages",
    blurb:
      "Subtopic pages. Each goes deep on one angle and belongs to a pillar page.",
  },
];

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

export default async function PagesListPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await props.searchParams;
  const active: PageType =
    tab === "pillar" || tab === "cluster" ? tab : "standard";

  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select(
      "id, title, slug, published, has_draft, is_homepage, page_type, components, updated_at",
    )
    .order("is_homepage", { ascending: false })
    .order("title");
  const pages = (data ?? []) as PageRow[];

  const counts: Record<PageType, number> = {
    standard: pages.filter((p) => p.page_type === "standard").length,
    pillar: pages.filter((p) => p.page_type === "pillar").length,
    cluster: pages.filter((p) => p.page_type === "cluster").length,
  };
  const visible = pages.filter((p) => p.page_type === active);
  const activeTab = TABS.find((t) => t.type === active)!;

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

      {/* Page-type tabs */}
      <div className="mt-6 flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const isActive = t.type === active;
          return (
            <Link
              key={t.type}
              href={`/admin/pages?tab=${t.type}`}
              className={`font-body text-small rounded-md px-3 py-1.5 border transition-colors ${
                isActive
                  ? "bg-ink text-on-dark border-ink font-medium"
                  : "bg-page text-ink-secondary border-divider hover:text-ink"
              }`}
            >
              {t.label} ({counts[t.type]})
            </Link>
          );
        })}
      </div>

      <p className="font-body text-small text-ink-secondary mt-3">
        {activeTab.blurb}
      </p>

      <div className="mt-3 border border-divider rounded-lg overflow-hidden bg-page">
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
            {visible.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="font-body text-small text-ink-secondary px-4 py-8 text-center"
                >
                  No {activeTab.label.toLowerCase()} yet.
                </td>
              </tr>
            ) : (
              visible.map((p) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import Link from "next/link";

const CARDS = [
  {
    label: "Pages",
    href: "/admin/pages",
    desc: "Edit your site's pages and arrange their components.",
  },
  {
    label: "Navigation",
    href: "/admin/navigation",
    desc: "Edit the header logo and navigation links.",
  },
  {
    label: "Media",
    href: "/admin/media",
    desc: "Upload and manage images.",
  },
  {
    label: "Variables",
    href: "/admin/variables",
    desc: "Edit reusable values like contact details.",
  },
  {
    label: "Colours",
    href: "/admin/theme",
    desc: "Edit the site's colour palette.",
  },
];

export default function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-section text-ink">Overview</h1>
      <p className="font-body text-small text-ink-soft mt-1">
        Manage the Yard House Studio website.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="border border-divider rounded-lg bg-page p-5 hover:border-ink transition-colors"
          >
            <span className="font-body text-body font-medium text-ink">
              {c.label}
            </span>
            <p className="font-body text-small text-ink-soft mt-1 leading-relaxed">
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

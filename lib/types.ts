export type FieldType =
  | "text"
  | "textarea"
  | "image"
  | "number"
  | "checkbox"
  | "color"
  | "date"
  | "select"
  | "page-selector"
  | "array";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  /** Friendly labels for select options (key = stored value). */
  optionLabels?: Record<string, string>;
  default?: unknown;
  itemSchema?: Field[];
  /** Disable this field when another prop equals `value`. */
  disabledWhen?: { key: string; value: string };
  disabledHint?: string;
};

export type ComponentInstance = {
  type: string;
  order: number;
  contentKey: string;
  props: Record<string, unknown>;
  anchorId: string;
};

export type PageRow = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  components: ComponentInstance[];
  published: boolean;
  is_homepage: boolean;
  has_draft: boolean;
  draft_components: ComponentInstance[] | null;
};

export type NavbarLink = { label: string; href: string; order: number };

export type CtaMode = "link" | "whatsapp-router";

export type NavbarRow = {
  id: number;
  logo: { text: string; href: string };
  links: NavbarLink[];
  cta_button: { label: string; href: string; mode?: CtaMode } | null;
};

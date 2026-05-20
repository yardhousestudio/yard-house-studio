import type { Field } from "@/lib/types";

export type ComponentSchema = {
  label: string;
  fields: Field[];
  defaults: Record<string, unknown>;
};

export const componentSchemas: Record<string, ComponentSchema> = {
  "site-header": {
    label: "Site header",
    fields: [
      { key: "sticky", label: "Sticky", type: "checkbox", default: true },
      { key: "withBlur", label: "Backdrop blur", type: "checkbox", default: true },
    ],
    defaults: { sticky: true, withBlur: true },
  },

  "hero-image-text": {
    label: "Hero — image + text",
    fields: [
      {
        key: "slides",
        label: "Before / after pairs (auto-rotate after; button reveals before)",
        type: "array",
        itemSchema: [
          { key: "beforeImage", label: "Before image", type: "image" },
          { key: "afterImage", label: "After image", type: "image" },
          { key: "beforeAlt", label: "Before alt text (optional)", type: "text" },
          { key: "afterAlt", label: "After alt text (optional)", type: "text" },
        ],
      },
      {
        key: "image",
        label: "Fallback image (when no slideshow pairs)",
        type: "image",
      },
      { key: "imageAlt", label: "Image alt text", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "primaryCtaLabel", label: "Primary button label (blank = hidden)", type: "text" },
      { key: "primaryCtaHref", label: "Primary button link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary button label (blank = hidden)", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "text" },
    ],
    defaults: {
      slides: [],
      image: "",
      imageAlt: "Edinburgh period architecture",
      headline:
        "Thoughtful property improvement for homes that deserve more care than a quick fix.",
      subtitle:
        "A premium Edinburgh studio combining practical hands-on capability with strong spatial judgement, taste, and sensitivity to period homes.",
      primaryCtaLabel: "Get in touch",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Our services",
      secondaryCtaHref: "#services",
    },
  },

  "page-hero": {
    label: "Page hero (inner pages)",
    fields: [
      { key: "label", label: "Eyebrow label (optional)", type: "text" },
      { key: "headline", label: "Headline", type: "textarea" },
      { key: "subtitle", label: "Subtitle (optional)", type: "textarea" },
      { key: "primaryCtaLabel", label: "Primary button label (blank = hidden)", type: "text" },
      { key: "primaryCtaHref", label: "Primary button link", type: "text" },
      { key: "secondaryCtaLabel", label: "Secondary button label (blank = hidden)", type: "text" },
      { key: "secondaryCtaHref", label: "Secondary button link", type: "text" },
    ],
    defaults: {
      label: "",
      headline: "A considered approach to every project.",
      subtitle: "",
      primaryCtaLabel: "",
      primaryCtaHref: "",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
    },
  },

  divider: {
    label: "Divider",
    fields: [],
    defaults: {},
  },

  "services-three-column": {
    label: "Services — three columns",
    fields: [
      { key: "label", label: "Section label", type: "text" },
      { key: "title", label: "Section title", type: "text" },
      { key: "anchor", label: "Anchor id", type: "text" },
      {
        key: "items",
        label: "Items",
        type: "array",
        itemSchema: [
          { key: "number", label: "Number", type: "text" },
          { key: "title", label: "Title", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
    defaults: {
      label: "Services",
      title: "Three layers of care",
      anchor: "services",
      items: [
        {
          number: "01",
          title: "Property Care & Turnaround",
          description:
            "End-of-tenancy works, repairs, decorating, maintenance, property condition audits, cleaning and presentation.",
        },
        {
          number: "02",
          title: "Intelligent Home Improvements",
          description:
            "Integrated storage solutions, built-in style improvements, cable management, room layout optimisation, and subtle architectural upgrades.",
        },
        {
          number: "03",
          title: "Renovation Planning & Phased Improvements",
          description:
            "Planning renovations over time, identifying missed opportunities in floorplans, sequencing works intelligently, budget-conscious but design-led.",
        },
      ],
    },
  },

  "dark-two-column": {
    label: "Dark — two columns",
    fields: [
      { key: "label", label: "Section label", type: "text" },
      { key: "title", label: "Title", type: "textarea" },
      { key: "anchor", label: "Anchor id", type: "text" },
      {
        key: "paragraphs",
        label: "Paragraphs",
        type: "array",
        itemSchema: [{ key: "", label: "Paragraph", type: "textarea" }],
      },
    ],
    defaults: {
      label: "Why Yard House",
      title: "Not a contractor. Not a designer. Something more considered.",
      anchor: "about",
      paragraphs: [
        "Yard House Studio sits between a contractor, property maintenance company, and design studio. We combine practical hands-on capability with strong spatial judgement, taste, and sensitivity to period and listed homes.",
        "We understand that homes — particularly Edinburgh's period properties — deserve more than a quick fix. Every intervention should be thoughtful, considered, and ultimately improve how a space functions and feels.",
      ],
    },
  },

  "image-text-split": {
    label: "Image + text split",
    fields: [
      { key: "image", label: "Image", type: "image" },
      { key: "imageAlt", label: "Image alt text", type: "text" },
      {
        key: "imagePosition",
        label: "Image position",
        type: "select",
        options: ["left", "right"],
        default: "left",
      },
      { key: "label", label: "Section label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "body", label: "Body", type: "textarea" },
    ],
    defaults: {
      image: "",
      imageAlt: "Stockbridge Colonies, Edinburgh",
      imagePosition: "left",
      label: "Heritage",
      title: "Where Yard House began.",
      body: [
        "The name Yard House comes from our home in the Stockbridge Colonies, built on the site of the original builders’ yard used to construct the colonies themselves.",
        "That renovation was our first true lesson in sensitive property work: a full flat refurbishment shaped by Grade B listing constraints, conservation rules, and the quirks that come with old Edinburgh buildings.",
        "Lath and plaster. Limestone walls. Period detailing. Legacy services hidden where you least expect them.",
        "These homes aren’t generic. Whether it’s your family home or part of your portfolio, getting the details right matters.",
        "We bring a premium eye, practical judgement, and trusted trades, without the inflated price tag.",
      ].join("\n\n"),
    },
  },

  "centered-contact": {
    label: "Centered contact",
    fields: [
      { key: "label", label: "Section label", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea" },
      { key: "anchor", label: "Anchor id", type: "text" },
      {
        key: "items",
        label: "Contact items",
        type: "array",
        itemSchema: [
          { key: "label", label: "Label", type: "text" },
          { key: "value", label: "Value", type: "text" },
          {
            key: "type",
            label: "Type",
            type: "select",
            options: ["email", "phone", "text"],
          },
        ],
      },
      { key: "ctaLabel", label: "Button label (blank = hidden)", type: "text" },
      { key: "ctaHref", label: "Button link", type: "text" },
    ],
    defaults: {
      label: "Contact",
      title: "Let's talk about your home.",
      subtitle:
        "Whether you're an estate agent, landlord, or homeowner — we'd love to hear about your property.",
      anchor: "contact",
      items: [
        { label: "Email", value: "${SUPPORT_EMAIL}", type: "email" },
        { label: "Phone", value: "${PHONE}", type: "phone" },
        { label: "Web", value: "${SITE_URL}", type: "text" },
      ],
      ctaLabel: "Send us an enquiry",
      ctaHref: "mailto:${SUPPORT_EMAIL}",
    },
  },

  "site-footer": {
    label: "Site footer",
    fields: [
      { key: "brand", label: "Brand text", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "location", label: "Location", type: "text" },
    ],
    defaults: {
      brand: "Yard House Studio",
      tagline: "Thoughtful Property Improvement",
      location: "${LOCATION}",
    },
  },
};

export type ComponentType = keyof typeof componentSchemas;

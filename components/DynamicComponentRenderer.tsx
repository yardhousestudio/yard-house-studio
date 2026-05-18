import { Fragment } from "react";
import { CenteredContact } from "@/components/blocks/CenteredContact";
import { DarkTwoColumn } from "@/components/blocks/DarkTwoColumn";
import { Divider } from "@/components/blocks/Divider";
import { HeroImageText } from "@/components/blocks/HeroImageText";
import { ImageTextSplit } from "@/components/blocks/ImageTextSplit";
import { PageHero } from "@/components/blocks/PageHero";
import { ServicesThreeColumn } from "@/components/blocks/ServicesThreeColumn";
import { SiteFooter } from "@/components/blocks/SiteFooter";
import { SiteHeader } from "@/components/blocks/SiteHeader";
import { componentSchemas } from "@/app/admin/components/componentSchemas";
import { interpolateVariables, variablesFromRows } from "@/lib/interpolateVariables";
import type { ComponentInstance } from "@/lib/types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlockComponent = (props: any) => React.ReactNode | Promise<React.ReactNode>;

const registry: Record<string, BlockComponent> = {
  "site-header": SiteHeader,
  "hero-image-text": HeroImageText,
  "page-hero": PageHero,
  divider: Divider,
  "services-three-column": ServicesThreeColumn,
  "dark-two-column": DarkTwoColumn,
  "image-text-split": ImageTextSplit,
  "centered-contact": CenteredContact,
  "site-footer": SiteFooter,
};

type Props = {
  components: ComponentInstance[];
  variables: Array<{ key: string; value: string }>;
};

export function DynamicComponentRenderer({ components, variables }: Props) {
  const vars = variablesFromRows(variables);
  const ordered = [...components].sort((a, b) => a.order - b.order);

  return (
    <>
      {ordered.map((c) => {
        const Component = registry[c.type];
        if (!Component) {
          if (process.env.NODE_ENV !== "production") {
            console.warn(`Unknown component type: ${c.type}`);
          }
          return null;
        }

        const schema = componentSchemas[c.type];
        const merged = { ...(schema?.defaults ?? {}), ...c.props };
        const interpolated = interpolateVariables(merged, vars);
        const anchorId = c.anchorId || undefined;

        return (
          <Fragment key={c.contentKey}>
            <Component {...interpolated} anchorId={anchorId} />
          </Fragment>
        );
      })}
    </>
  );
}

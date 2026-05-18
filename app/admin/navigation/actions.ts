"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const NavbarSchema = z.object({
  logo: z.object({ text: z.string().min(1), href: z.string() }),
  links: z.array(
    z.object({
      label: z.string().min(1),
      href: z.string().min(1),
      order: z.number(),
    }),
  ),
  cta_button: z
    .object({ label: z.string(), href: z.string() })
    .nullable(),
});

export async function updateNavbar(input: unknown) {
  const data = NavbarSchema.parse(input);
  const supabase = await createClient();
  const { error } = await supabase
    .from("navbar")
    .update({
      logo: data.logo,
      links: data.links,
      cta_button: data.cta_button,
      updated_at: new Date().toISOString(),
    })
    .eq("id", 1);
  if (error) throw error; // RLS rejects non-admins
  revalidatePath("/");
}

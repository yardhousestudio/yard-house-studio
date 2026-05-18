"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ColorsSchema = z.record(
  z.string(),
  z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a 6-digit hex colour, e.g. #1A1A1A"),
);

export async function saveTheme(input: unknown) {
  const colors = ColorsSchema.parse(input);
  const supabase = await createClient();
  const { error } = await supabase
    .from("theme")
    .upsert(
      { id: 1, colors, updated_at: new Date().toISOString() },
      { onConflict: "id" },
    );
  if (error) throw error; // RLS rejects non-admins
  revalidatePath("/");
}

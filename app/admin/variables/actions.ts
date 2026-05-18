"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const RowSchema = z.object({
  id: z.string().optional(),
  key: z
    .string()
    .min(1)
    .regex(
      /^[A-Z0-9_]+$/,
      "Keys must be uppercase letters, numbers and underscores",
    ),
  value: z.string(),
});

export async function saveVariables(input: unknown) {
  const rows = z.array(RowSchema).parse(input);
  const supabase = await createClient();
  for (const row of rows) {
    if (row.id) {
      const { error } = await supabase
        .from("site_variables")
        .update({ value: row.value })
        .eq("id", row.id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("site_variables")
        .insert({ key: row.key, value: row.value });
      if (error) throw error;
    }
  }
  revalidatePath("/");
}

export async function deleteVariable(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("site_variables")
    .delete()
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/");
}

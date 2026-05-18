import { createClient } from "@/lib/supabase/server";
import { VariablesEditor } from "@/components/admin/VariablesEditor";

type VariableRow = { id: string; key: string; value: string };

export default async function VariablesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_variables")
    .select("id, key, value")
    .order("key");

  return (
    <div>
      <h1 className="font-display text-section text-ink">Variables</h1>
      <p className="font-body text-small text-ink-2 mt-1 mb-6">
        Reusable values referenced in content as{" "}
        <code className="font-body text-small text-ink">${"{KEY}"}</code> — edit
        them in one place and they update everywhere.
      </p>
      <VariablesEditor initial={(data ?? []) as VariableRow[]} />
    </div>
  );
}

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache configured — pages render fresh from Supabase per
// request. Fine at launch scale. To add ISR persistence later, wire an
// R2-backed incrementalCache here and re-add the R2 binding in wrangler.jsonc.
export default defineCloudflareConfig({});

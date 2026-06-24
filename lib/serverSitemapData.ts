import { unstable_cache } from "next/cache";
import { createClient } from "@supabase/supabase-js";

function createServerSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false } },
  );
}

async function fetchEquipmentSitemapEntries(): Promise<
  { category: string; key: string }[]
> {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from("equipment_info")
    .select("category, key")
    .gt("currently_used", 0);

  if (error) {
    console.error("Sitemap: failed to fetch equipment_info", error);
    return [];
  }

  return (data ?? []) as { category: string; key: string }[];
}

export const getServerEquipmentSitemapEntries = unstable_cache(
  fetchEquipmentSitemapEntries,
  ["sitemap-equipment"],
  { revalidate: 3600 },
);

import {
  PUBLIC_COMMUNITY_POST_COLUMNS,
  type CommunityPostPublic,
} from "./communityPosts";
import {
  getSupabaseAdmin,
  isSupabaseAdminConfigured,
} from "./security/supabaseAdmin";

export async function getServerCommunityPosts(
  page = 0,
  limit = 20,
): Promise<CommunityPostPublic[]> {
  if (!isSupabaseAdminConfigured()) return [];

  const safeLimit = Math.min(50, Math.max(1, limit));
  const from = Math.max(0, page) * safeLimit;
  const to = from + safeLimit - 1;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("community_posts")
      .select(PUBLIC_COMMUNITY_POST_COLUMNS)
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Server: failed to fetch community posts", error);
      return [];
    }

    return (data ?? []) as CommunityPostPublic[];
  } catch (err) {
    console.error("Server: community posts unavailable", err);
    return [];
  }
}

export async function getServerCommunityPost(
  id: string,
): Promise<CommunityPostPublic | null> {
  const postId = Number(id);
  if (!Number.isInteger(postId) || postId <= 0) return null;
  if (!isSupabaseAdminConfigured()) return null;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("community_posts")
      .select(PUBLIC_COMMUNITY_POST_COLUMNS)
      .eq("id", postId)
      .maybeSingle();

    if (error) {
      console.error("Server: failed to fetch community post", error);
      return null;
    }

    return (data as CommunityPostPublic | null) ?? null;
  } catch (err) {
    console.error("Server: community post unavailable", err);
    return null;
  }
}

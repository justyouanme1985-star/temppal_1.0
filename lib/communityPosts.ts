export const PUBLIC_COMMUNITY_POST_COLUMNS =
  "id, created_at, author_nickname, title, content, file_urls";

export type CommunityPostPublic = {
  id: number;
  created_at: string;
  author_nickname: string;
  title: string;
  content: string;
  file_urls: string[];
};

/** Public object URL prefix for the community_attachments bucket. */
export function getCommunityAttachmentUrlPrefix(): string | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return null;
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/community_attachments/`;
}

/** Accept only URLs uploaded to our Supabase storage bucket (max 3). */
export function sanitizeCommunityFileUrls(fileUrls: unknown): string[] {
  if (!Array.isArray(fileUrls)) return [];

  const prefix = getCommunityAttachmentUrlPrefix();
  if (!prefix) return [];

  const allowed: string[] = [];
  for (const raw of fileUrls.slice(0, 3)) {
    if (typeof raw !== "string") continue;
    const url = raw.trim();
    if (!url.startsWith(prefix)) continue;
    try {
      // Reject javascript:, data:, etc. even if they somehow matched prefix checks.
      const parsed = new URL(url);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") continue;
      allowed.push(url);
    } catch {
      /* skip invalid URL */
    }
  }
  return allowed;
}

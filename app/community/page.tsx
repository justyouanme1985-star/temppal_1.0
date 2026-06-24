import { communityListMetadata } from "@/lib/communitySeo";
import { getServerCommunityPosts } from "@/lib/serverCommunityData";
import CommunityPageClient from "@/components/CommunityPageClient";

export const revalidate = 60;

const PAGE_SIZE = 20;

export const metadata = communityListMetadata;

export default async function CommunityPage() {
  const posts = await getServerCommunityPosts(0, PAGE_SIZE);
  return (
    <CommunityPageClient
      initialPosts={posts}
      initialHasMore={posts.length >= PAGE_SIZE}
      pageSize={PAGE_SIZE}
    />
  );
}

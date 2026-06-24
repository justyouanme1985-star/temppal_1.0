import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildCommunityPostMetadata } from "@/lib/communitySeo";
import { getServerCommunityPost } from "@/lib/serverCommunityData";
import CommunityPostClient from "@/components/CommunityPostClient";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const post = await getServerCommunityPost(id);
  if (!post) {
    return { title: "게시글을 찾을 수 없습니다 | 템빨" };
  }
  return buildCommunityPostMetadata(post);
}

export default async function CommunityPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await getServerCommunityPost(id);

  if (!post) {
    notFound();
  }

  return <CommunityPostClient post={post} />;
}

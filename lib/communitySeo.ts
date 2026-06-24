import type { Metadata } from "next";
import type { CommunityPostPublic } from "./communityPosts";

export const communityListMetadata: Metadata = {
  title: {
    absolute: "커뮤니티 | 템빨",
  },
  description: "템빨 커뮤니티 — 프로게이머 장비, 게이밍 기어 관련 게시글.",
  alternates: {
    canonical: "/community",
  },
  openGraph: {
    title: "템빨 커뮤니티",
    description: "프로게이머 장비 커뮤니티",
    images: [{ url: "/images/banner.svg", alt: "템빨" }],
  },
};

export function buildCommunityPostMetadata(post: CommunityPostPublic): Metadata {
  const snippet = post.content
    ? post.content.replace(/\s+/g, " ").trim().slice(0, 120)
    : post.title;

  return {
    title: {
      absolute: `${post.title} | 템빨 커뮤니티`,
    },
    description: `${post.author_nickname}: ${snippet}`,
    alternates: {
      canonical: `/community/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: snippet,
      type: "article",
      images: [{ url: "/images/banner.svg", alt: post.title }],
    },
  };
}

export const communityWriteMetadata: Metadata = {
  title: { absolute: "글쓰기 | 템빨 커뮤니티" },
  robots: { index: false, follow: false },
};

export function buildMailComposeMetadata(type: string): Metadata {
  const label = type === "report" ? "신고/접수" : "문의";
  return {
    title: { absolute: `${label} | 템빨` },
    robots: { index: false, follow: false },
  };
}

export function buildSearchMetadata(query: string): Metadata {
  const q = query.trim();
  return {
    title: {
      absolute: q ? `"${q}" 검색 | 템빨` : "검색 | 템빨",
    },
    description: q
      ? `템빨에서 "${q}" 프로게이머·장비 검색 결과`
      : "프로게이머 이름, 팀 이름으로 검색",
    robots: { index: false, follow: false },
  };
}

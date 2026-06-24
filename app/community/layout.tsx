import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "커뮤니티",
  description: "템빨 커뮤니티 — 장비 정보, 세팅 팁, 자유 게시판",
  alternates: { canonical: "/community" },
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

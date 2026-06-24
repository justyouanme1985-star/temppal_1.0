import type { Metadata } from "next";
import { absoluteUrl, pageTitle } from "@/lib/seo/site";
import SearchPageClient from "./SearchPageClient";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q?.trim();

  if (!query) {
    return {
      title: pageTitle("선수 검색"),
      description: "프로게이머 이름, 팀, 초성으로 선수를 검색하세요.",
      alternates: { canonical: "/search" },
    };
  }

  const title = `"${query}" 검색 결과`;
  const description = `"${query}" 프로게이머 검색 — 장비 세팅과 랭킹을 확인하세요.`;

  return {
    title: pageTitle(title),
    description,
    openGraph: {
      title,
      description,
      url: absoluteUrl(`/search?q=${encodeURIComponent(query)}`),
    },
    alternates: {
      canonical: `/search?q=${encodeURIComponent(query)}`,
    },
    robots: { index: false, follow: true },
  };
}

export default function SearchPage() {
  return <SearchPageClient />;
}

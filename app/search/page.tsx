import type { Metadata } from "next";
import { buildSearchMetadata } from "@/lib/communitySeo";
import { getServerSearchResults } from "@/lib/serverSearch";
import SearchPageClient from "@/components/SearchPageClient";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return buildSearchMetadata(q ?? "");
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q ?? "";
  const results = query.trim() ? await getServerSearchResults(query) : [];

  return <SearchPageClient query={query} initialResults={results} />;
}

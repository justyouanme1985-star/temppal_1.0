import type { Metadata } from "next";
import Link from "next/link";
import { NOINDEX_ROBOTS } from "@/lib/indexing";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  robots: NOINDEX_ROBOTS,
};

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

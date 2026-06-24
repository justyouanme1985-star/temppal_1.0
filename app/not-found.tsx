import Link from "next/link";
import { pageTitle } from "@/lib/seo/site";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
        요청하신 페이지가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}

export const metadata = {
  title: pageTitle("페이지를 찾을 수 없음"),
  robots: { index: false, follow: false },
};

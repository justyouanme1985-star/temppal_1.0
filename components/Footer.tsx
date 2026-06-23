import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-700 py-12 bg-white dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Link href="/terms">
            <span className="text-1xl font-black tracking-tighter text-zinc-900 dark:text-white hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors">
              이용약관
            </span>
          </Link>

          <Link href="/privacy">
            <span className="text-1xl font-black tracking-tighter text-zinc-900 dark:text-white hover:text-emerald-400 dark:hover:text-emerald-400 transition-colors">
              개인정보처리방침
            </span>
          </Link>
        </div>

        <div className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed mt-2 max-w-xl mx-auto">
          본 사이트는 쿠팡 파트너스 활동의 일환으로, 이에 따른 일정액의 수수료를
          제공받습니다.
        </div>

        <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-4">
          © 2026 Temppal. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
